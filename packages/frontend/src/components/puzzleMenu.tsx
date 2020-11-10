import { InfoCircleOutlined, MenuOutlined, SelectOutlined, TeamOutlined, UndoOutlined } from "@ant-design/icons";
import { ICompletePlugin, IConvertToFrontend, IPlayer, IPlayerToServerTypes } from "@blue-indium/api";
import { Dropdown, Menu, message, Modal } from "antd";
import * as React from "react";
import styles from "./puzzleMenu.module.scss";

interface IProps {
    connectedPlayers: IPlayer[];
    currentPlayer: IPlayer;
    playerToServerService: IConvertToFrontend<IPlayerToServerTypes>;
    puzzleMetadata: Pick<ICompletePlugin<any, any, any>, "metadata">;
    resetSelectedPuzzle: () => void;
}

function showPuzzleMetadataModal(puzzleMetadata: Pick<ICompletePlugin<any, any, any>, "metadata">) {
    const { metadata } = puzzleMetadata;

    Modal.info({
        title: metadata.name,
        content: (
            <div className={styles.modalContainer}>
                <div className={styles.puzzleMetadataRow}>
                    <span className={styles.puzzleMetadataRowTitle}>Description</span>
                    <span>{metadata.description ?? "No description"}</span>
                </div>
                <div className={styles.puzzleMetadataRow}>
                    <span className={styles.puzzleMetadataRowTitle}>Difficulty</span>
                    <span>{metadata.difficulty ?? "Unknown difficulty"}</span>
                </div>
                <div className={styles.puzzleMetadataRow}>
                    <span className={styles.puzzleMetadataRowTitle}>Minimum players</span>
                    <span>{metadata.minimumPlayers ?? "No minimum player count"}</span>
                </div>
                <div className={styles.puzzleMetadataRow}>
                    <span className={styles.puzzleMetadataRowTitle}>Recommended players</span>
                    <span>{metadata.recommendedPlayers ?? "No recommended player count"}</span>
                </div>
            </div>
        ),
    });
}

function showConnectedPlayers(connectedPlayers: IPlayer[], currentPlayer: IPlayer) {
    Modal.info({
        title: "Connected players",
        content: (
            <div className={styles.modalContainer}>
                {connectedPlayers.map(player => (
                    <div className={styles.puzzleMetadataRow}>
                        <span className={styles.puzzleMetadataRowTitle}>
                            {player.name} {currentPlayer.id === player.id && "(you)"}
                        </span>
                        <span>{player.id}</span>
                    </div>
                ))}
            </div>
        ),
    });
}

export const PuzzleMenu: React.FC<IProps> = ({
    connectedPlayers,
    currentPlayer,
    playerToServerService,
    puzzleMetadata,
    resetSelectedPuzzle,
}) => {
    const resetPuzzle = () => {
        playerToServerService.resetPuzzle({});
        message.success("Reset");
    };

    const showPuzzleMetadata = () => showPuzzleMetadataModal(puzzleMetadata);

    const openCurrentPlayers = () => showConnectedPlayers(connectedPlayers, currentPlayer);

    return (
        <div className={styles.topNavigationBar}>
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item onClick={showPuzzleMetadata}>
                            <InfoCircleOutlined /> Information
                        </Menu.Item>
                        <Menu.Item onClick={openCurrentPlayers}>
                            <TeamOutlined /> Players
                        </Menu.Item>
                        <Menu.Item onClick={resetPuzzle}>
                            <UndoOutlined /> Reset puzzle
                        </Menu.Item>
                        <Menu.Item onClick={resetSelectedPuzzle}>
                            <SelectOutlined /> Choose a different puzzle
                        </Menu.Item>
                    </Menu>
                }
                trigger={["click"]}
            >
                <MenuOutlined />
            </Dropdown>
        </div>
    );
};
