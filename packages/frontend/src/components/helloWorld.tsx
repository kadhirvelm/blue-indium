import * as React from "react";
import SocketIO from "socket.io-client";
import { PuzzlesFrontend } from "@blue-indium/puzzles";
import { dynamicallyImportCSSForPuzzle, FromServerToPlayer } from "@blue-indium/api";
import * as styles from "./helloWorld.module.scss";

interface IState {
    gameState: any | undefined;
}

const PuzzleTemplate = PuzzlesFrontend["puzzle-template"].puzzle;

export class HelloWorld extends React.PureComponent<{}, IState> {
    private socketService: any = undefined;

    public state: IState = {
        gameState: undefined,
    };

    public componentDidMount() {
        const socket = SocketIO(`127.0.0.1:3000/${PuzzleTemplate.metadata.id}`);

        this.socketService = Object.keys(PuzzleTemplate.socketService)
            .map(key => ({ [key]: (PuzzleTemplate.socketService as any)[key].frontend(socket).sendEvent }))
            .reduce((a, b) => ({ ...a, ...b }), {});

        socket.on("connect", () => {
            FromServerToPlayer.onUpdateGameState.frontend(socket).onEvent(newGameState => {
                this.setState({ gameState: newGameState.gameState });
            });
        });

        dynamicallyImportCSSForPuzzle(PuzzlesFrontend["puzzle-template"].packageName);
    }

    public render() {
        const { gameState } = this.state;
        if (this.socketService === undefined) {
            return null;
        }

        return <div className={styles.test}>{PuzzleTemplate.frontend(gameState, this.socketService)}</div>;
    }
}
