import { InfoCircleOutlined, MenuOutlined, SelectOutlined, UndoOutlined } from "@ant-design/icons";
import { IConvertToFrontend, IPlayerToServerTypes, IPuzzlePlugin } from "@blue-indium/api";
import { Dropdown, Menu, message, Modal } from "antd";
import * as React from "react";
import styles from "./puzzleMenu.module.scss";

interface IProps {
    playerToServerService: IConvertToFrontend<IPlayerToServerTypes>;
    puzzleMetadata: Pick<IPuzzlePlugin<any, any, any>, "metadata">;
    resetSelectedPuzzle: () => void;
}

function showPuzzleMetadataModal(puzzleMetadata: Pick<IPuzzlePlugin<any, any, any>, "metadata">) {
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

export const PuzzleMenu: React.FC<IProps> = ({ playerToServerService, puzzleMetadata, resetSelectedPuzzle }) => {
    const resetPuzzle = () => {
        playerToServerService.resetPuzzle({});
        message.success("Reset");
    };

    const openModal = () => showPuzzleMetadataModal(puzzleMetadata);

    return (
        <div className={styles.topNavigationBar}>
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item onClick={openModal}>
                            <InfoCircleOutlined /> Information
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
