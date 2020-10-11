import { FromServerToPlayer } from "@blue-indium/api";
import { Server } from "http";
import SocketIO from "socket.io";
import { PuzzlesBackend } from "@blue-indium/puzzles";

export function instantiatePuzzles(server: Server) {
    const PuzzleOne = PuzzlesBackend["puzzle-template"].puzzle;

    let gameState = PuzzleOne.initialState.initialGameState;
    let internalState = PuzzleOne.initialState.initialInternalState;

    const puzzleSocket = SocketIO(server, { serveClient: false }).of(PuzzleOne.metadata.id);

    puzzleSocket.on("connection", socket => {
        FromServerToPlayer.onUpdateGameState.backend(socket).sendEvent({ gameState });

        const events = Object.keys(PuzzleOne.backend);

        events.forEach(eventName => {
            socket.on(eventName, payload => {
                const newState = (PuzzleOne.backend as any)[eventName](payload, {
                    gameState,
                    internalState,
                });

                gameState = newState.gameState;
                internalState = newState.internalState;

                FromServerToPlayer.onUpdateGameState.backend(puzzleSocket).sendEvent({ gameState });
            });
        });
    });
}
