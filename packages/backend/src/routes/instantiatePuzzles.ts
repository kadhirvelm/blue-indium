import { FromServerToPlayer } from "@blue-indium/api";
import { Server } from "http";
import SocketIO from "socket.io";
import { PuzzleOne } from "@blue-indium/puzzles-puzzle-1";

export function instantiatePuzzles(server: Server) {
    let gameState = PuzzleOne.initialState.initialGameState;
    let internalState = PuzzleOne.initialState.initialInternalState;

    const puzzleSocket = SocketIO(server, { serveClient: false }).of(PuzzleOne.metadata.id);

    puzzleSocket.on("connection", socket => {
        console.log("Connected", socket.id);

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
