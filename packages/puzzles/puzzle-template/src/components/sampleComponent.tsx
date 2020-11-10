import { IConvertToFrontend } from "@blue-indium/api";
import * as React from "react";
import { Button } from "antd";
import { IGameState, ISocketService } from "../types";
import styles from "./sampleComponent.module.scss";

interface IProps {
    gameState: IGameState | undefined;
    services: IConvertToFrontend<ISocketService>;
}

export const SampleComponent: React.FC<IProps> = ({ gameState, services }) => {
    const onButtonClick = () => services.toggleTreasureChest({ isOpen: !gameState?.isTreasureChestOpen });

    if (gameState === undefined) {
        return <div>Not connected yet.</div>;
    }

    return (
        <div className={styles.sampleComponentContainer}>
            <Button onClick={onButtonClick}>{gameState.isTreasureChestOpen ? "Close" : "Open"} treasure chest.</Button>
        </div>
    );
};
