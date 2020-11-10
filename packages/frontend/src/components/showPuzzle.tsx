import { LikeFilled } from "@ant-design/icons";
import {
    dynamicallyImportCSS,
    FromServerToPlayer,
    IConvertToFrontend,
    IDefaultGameState,
    InfrastructureToServer,
    IPlayer,
    IPlayerToServerTypes,
    ORIGIN,
    PlayerToServer,
    PORT,
} from "@blue-indium/api";
import { IPuzzleFrontend } from "@blue-indium/puzzles";
import { Modal } from "antd";
import * as React from "react";
import SocketIO from "socket.io-client";
import { PuzzleMenu } from "./puzzleMenu";
import styles from "./showPuzzle.module.scss";

interface IProps {
    currentPlayer: IPlayer;
    resetSelectedPuzzle: () => void;
    selectedPuzzle: IPuzzleFrontend;
}

interface IState {
    connectedPlayers: IPlayer[];
    gameState: (IDefaultGameState & any) | undefined;
}

export class ShowPuzzle extends React.PureComponent<IProps, IState> {
    private puzzleSocketService: { [key: string]: (payload: any) => void };
    private playerToServerService: IConvertToFrontend<IPlayerToServerTypes>;

    private playerSocket: SocketIOClient.Socket;

    public state: IState = {
        connectedPlayers: [],
        gameState: undefined,
    };

    public constructor(props: IProps) {
        super(props);

        const { selectedPuzzle } = props;
        this.playerSocket = SocketIO(`${ORIGIN}:${PORT}/${selectedPuzzle.puzzle.metadata.id}`);

        this.puzzleSocketService = Object.keys(selectedPuzzle.puzzle.socketService)
            .map(key => ({
                [key]: selectedPuzzle.puzzle.socketService[key].frontend(this.playerSocket).sendEvent,
            }))
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
            currentPlayer,
            resetSelectedPuzzle,
            selectedPuzzle: { puzzle },
        } = this.props;
        const { connectedPlayers, gameState } = this.state;

        if (this.puzzleSocketService === undefined || this.playerToServerService === undefined) {
            return null;
        }

        this.maybeShowCompletedPuzzleModal();

        return (
            <div className={styles.container}>
                <PuzzleMenu
                    connectedPlayers={connectedPlayers}
                    currentPlayer={currentPlayer}
                    playerToServerService={this.playerToServerService}
                    resetSelectedPuzzle={resetSelectedPuzzle}
                    puzzleMetadata={puzzle}
                />
                {puzzle.frontend(
                    gameState,
                    {
                        ...this.puzzleSocketService,
                        ...this.playerToServerService,
                    },
                    { allPlayers: connectedPlayers, currentPlayer },
                )}
            </div>
        );
    }

    private connectSocketAndRegisterPlayer = () => {
        this.playerSocket.on("connect", () => {
            FromServerToPlayer.onUpdateGameState.frontend(this.playerSocket).onEvent(newGameState => {
                this.setState({ connectedPlayers: newGameState.connectedPlayers, gameState: newGameState.gameState });
            });

            const { currentPlayer } = this.props;
            InfrastructureToServer.onConnect
                .frontend(this.playerSocket)
                .sendEvent({ playerInformation: currentPlayer });
        });
    };

    private maybeShowCompletedPuzzleModal = () => {
        const { resetSelectedPuzzle } = this.props;
        const { gameState } = this.state;

        if (gameState === undefined || !(gameState as IDefaultGameState).hasSolvedPuzzle) {
            return;
        }

        const resetPuzzle = () => {
            this.playerToServerService.completePuzzle({});
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
