import { IConvertToFrontend } from "@blue-indium/api";
import * as React from "react";
import { IGameState, ISocketService } from "../types";
import styles from "./sampleComponent.module.scss";

interface IProps {
    gameState: IGameState | undefined;
    services: IConvertToFrontend<ISocketService>;
}

export class SampleComponent extends React.PureComponent<IProps> {
    public render() {
        const { gameState } = this.props;
        if (gameState === undefined) {
            return <div>Not connected yet.</div>;
        }

        return (
            <div className={styles.sampleComponentContainer}>
                <button onClick={this.onButtonClick} type="button">
                    {gameState.isTreasureChestOpen ? "Close" : "Open"} treasure chest.
                </button>
            </div>
        );
    }

    private onButtonClick = () => {
        const { gameState, services } = this.props;
        services.toggleTreasureChest({ isOpen: !gameState?.isTreasureChestOpen });
    };
}
