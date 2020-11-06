import {
    FromServerToPlayer,
    IDefaultGameState,
    InfrastructureToServer,
    IPlayer,
    PlayerToServer,
} from "@blue-indium/api";
import { IPuzzleBackend } from "@blue-indium/puzzles";
import { Server } from "http";
import SocketIO from "socket.io";

export class InstantiatePuzzle {
    private gameState: IDefaultGameState & any;
    private internalState: any;
    private connectedPlayers: Map<string, IPlayer> = new Map();

    private puzzleSocket: SocketIO.Namespace;

    constructor(server: Server, private selectedPuzzle: IPuzzleBackend) {
        this.puzzleSocket = SocketIO(server, { serveClient: false }).of(selectedPuzzle.puzzle.metadata.id);

        this.resetGameState();
        this.instantiateSocketConnections();
    }

    private instantiateSocketConnections() {
        this.puzzleSocket.on("connection", socket => {
            socket.on("disconnect", () => this.connectedPlayers.delete(socket.id));

            this.instantiateInfrastructureToServer(socket);
            this.instantiatePlayerToServer(socket);
            this.instantiateEventsForOneSocket(socket);

            this.updateGameState();
        });
    }

    private instantiateInfrastructureToServer(socket: SocketIO.Socket) {
        InfrastructureToServer.onConnect
            .backend(socket)
            .onEvent(({ playerInformation }) => this.connectedPlayers.set(socket.id, playerInformation));
    }

    private instantiatePlayerToServer(socket: SocketIO.Socket) {
        PlayerToServer.resetPuzzle.backend(socket).onEvent(() => {
            this.resetGameState();
            this.updateGameState();
        });
    }

    private instantiateEventsForOneSocket(socket: SocketIO.Socket) {
        const events = Object.keys(this.selectedPuzzle.puzzle.backend);

        events.forEach(eventName => {
            socket.on(eventName, payload => {
                const currentPlayer = this.getPlayerFromSocket(socket);

                if (currentPlayer === undefined) {
                    // eslint-disable-next-line no-console
                    console.error(
                        `A player attempted to call on an event without registering themselves first: ${eventName} with payload: ${JSON.stringify(
                            payload,
                        )}`,
                    );
                    return;
                }

                const newState = this.selectedPuzzle.puzzle.backend[eventName]?.(
                    payload,
                    {
                        gameState: this.gameState,
                        internalState: this.internalState,
                    },
                    {
                        currentPlayer,
                        allConnectedPlayers: Array.from(this.connectedPlayers.values()),
                    },
                );

                this.gameState = { ...this.gameState, ...newState.gameState };
                this.internalState = { ...this.internalState, ...newState.internalState };

                this.updateGameState();
            });
        });
    }

    private getPlayerFromSocket = (socket: SocketIO.Socket) => this.connectedPlayers.get(socket.id);

    private updateGameState() {
        FromServerToPlayer.onUpdateGameState.backend(this.puzzleSocket).sendEvent({ gameState: this.gameState });
    }

    private resetGameState() {
        this.gameState = { ...this.selectedPuzzle.puzzle.initialState.initialGameState, ...this.getDefaultGameState() };
        this.internalState = this.selectedPuzzle.puzzle.initialState.initialInternalState;
    }

    private getDefaultGameState(): IDefaultGameState {
        return {
            hasSolvedPuzzle: false,
        };
    }
}
