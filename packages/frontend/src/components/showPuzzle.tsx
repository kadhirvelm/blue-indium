import { LikeFilled } from "@ant-design/icons";
import {
    dynamicallyImportCSS,
    FromServerToPlayer,
    IConvertToFrontend,
    IDefaultGameState,
    InfrastructureToServer,
    IPlayerToServerTypes,
    PlayerToServer,
} from "@blue-indium/api";
import { IPuzzleFrontend } from "@blue-indium/puzzles";
import { Modal } from "antd";
import * as React from "react";
import SocketIO from "socket.io-client";
import { PuzzleMenu } from "./puzzleMenu";
import styles from "./showPuzzle.module.scss";

interface IProps {
    resetSelectedPuzzle: () => void;
    selectedPuzzle: IPuzzleFrontend;
}

interface IState {
    gameState: (IDefaultGameState & any) | undefined;
}

export class ShowPuzzle extends React.PureComponent<IProps, IState> {
    private puzzleSocketService: { [key: string]: (payload: any) => void };
    private playerToServerService: IConvertToFrontend<IPlayerToServerTypes>;

    private playerSocket: SocketIOClient.Socket;

    public state: IState = {
        gameState: undefined,
    };

    public constructor(props: IProps) {
        super(props);

        const { selectedPuzzle } = props;
        this.playerSocket = SocketIO(`127.0.0.1:3000/${selectedPuzzle.puzzle.metadata.id}`);

        this.puzzleSocketService = Object.keys(selectedPuzzle.puzzle.socketService)
            .map(key => ({ [key]: selectedPuzzle.puzzle.socketService[key].frontend(this.playerSocket).sendEvent }))
            .reduce((a, b) => ({ ...a, ...b }), {});

        this.playerToServerService = Object.keys(PlayerToServer)
            .map(key => ({
                [key]: PlayerToServer[key].frontend(this.playerSocket).sendEvent,
            }))
            .reduce((a, b) => ({ ...a, ...b }), {}) as IConvertToFrontend<IPlayerToServerTypes>;
    }

    public componentDidMount() {
        const { selectedPuzzle } = this.props;

        this.connectSocketAndRegisterPlayer();
        dynamicallyImportCSS(selectedPuzzle.packageName);
    }

    public render() {
        const {
            resetSelectedPuzzle,
            selectedPuzzle: { puzzle },
        } = this.props;
        const { gameState } = this.state;

        if (this.puzzleSocketService === undefined || this.playerToServerService === undefined) {
            return null;
        }

        this.maybeShowCompletedPuzzleModal();

        return (
            <div className={styles.container}>
                <PuzzleMenu
                    playerToServerService={this.playerToServerService}
                    resetSelectedPuzzle={resetSelectedPuzzle}
                    puzzleMetadata={puzzle}
                />
                {puzzle.frontend(gameState, {
                    ...this.puzzleSocketService,
                    ...this.playerToServerService,
                })}
            </div>
        );
    }

    private connectSocketAndRegisterPlayer = () => {
        this.playerSocket.on("connect", () => {
            FromServerToPlayer.onUpdateGameState.frontend(this.playerSocket).onEvent(newGameState => {
                this.setState({ gameState: newGameState.gameState });
            });

            InfrastructureToServer.onConnect
                .frontend(this.playerSocket)
                .sendEvent({ playerInformation: { id: "sample-player-one", name: "Sample player" } });
        });
    };

    private maybeShowCompletedPuzzleModal = () => {
        const { resetSelectedPuzzle } = this.props;
        const { gameState } = this.state;

        if (gameState === undefined || !(gameState as IDefaultGameState).hasSolvedPuzzle) {
            return;
        }

        const resetPuzzle = () => {
            this.playerToServerService.resetPuzzle({});
            resetSelectedPuzzle();
        };

        Modal.success({
            centered: true,
            content: <div>Congratulations! You completed the puzzle. Time to find another one.</div>,
            icon: <LikeFilled />,
            okText: "Complete puzzle",
            onOk: resetPuzzle,
            title: "Victory!",
        });
    };
}
