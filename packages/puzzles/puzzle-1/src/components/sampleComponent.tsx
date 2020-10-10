import * as React from "react";
import { IConvertToFrontend } from "@blue-indium/api";
import { IGameState, ISocketService } from "../types";

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
            <div>
                <button onClick={this.onButtonClick} type="button">
                    Open treasure chest.
                </button>
                <span>
                    {gameState.hasTreasureChestBeenOpened ? "Yay, you've opened the chest" : "The chest is closed"}
                </span>
            </div>
        );
    }

    private onButtonClick = () => {
        const { services } = this.props;
        services.openTreasureChest({});
    };
}
