import * as React from "react";
import SocketIO from "socket.io-client";
import { PuzzleOne } from "@blue-indium/puzzles-puzzle-1";
import { FromServerToPlayer } from "@blue-indium/api";

interface IState {
    gameState: any | undefined;
}

export class HelloWorld extends React.PureComponent<{}, IState> {
    private socketService: any = undefined;

    public state: IState = {
        gameState: undefined,
    };

    public componentDidMount() {
        const socket = SocketIO(`127.0.0.1:3000/${PuzzleOne.metadata.id}`);

        this.socketService = Object.keys(PuzzleOne.socketService)
            .map(key => ({ [key]: (PuzzleOne.socketService as any)[key].frontend(socket).sendEvent }))
            .reduce((a, b) => ({ ...a, ...b }), {});

        socket.on("connect", () => {
            FromServerToPlayer.onUpdateGameState.frontend(socket).onEvent(newGameState => {
                this.setState({ gameState: newGameState.gameState });
            });
        });
    }

    public render() {
        const { gameState } = this.state;
        if (this.socketService === undefined) {
            return null;
        }

        return PuzzleOne.frontend(gameState, this.socketService);
    }
}
