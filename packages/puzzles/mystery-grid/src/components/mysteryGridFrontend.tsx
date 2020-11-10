import { IConvertToFrontend, IPlayer } from "@blue-indium/api";
import * as React from "react";
import classNames from "classnames";
import { Popover, Tooltip } from "antd";
import { IGameState, ISocketService, IValidGrid, IValidGridColor } from "../types";
import styles from "./mysteryGridFrontend.module.scss";

interface IProps {
    gameState: IGameState | undefined;
    players: { allPlayers: IPlayer[]; currentPlayer: IPlayer };
    services: IConvertToFrontend<ISocketService>;
}

const Grid: React.FC<{
    currentPlayerVisible: "a" | "b";
    grid: IValidGrid;
    index: number;
    services: IConvertToFrontend<ISocketService>;
}> = ({ currentPlayerVisible, grid, index, services }) => {
    const key = `GRID_${index}`;

    if (grid.visibleTo === currentPlayerVisible || grid.visibleTo === "all") {
        return (
            <div
                className={classNames(styles.singleGrid, {
                    [styles.red]: grid.color === "red",
                    [styles.green]: grid.color === "green",
                    [styles.yellow]: grid.color === "yellow",
                    [styles.purple]: grid.color === "purple",
                    [styles.animateForEveryone]: grid.visibleTo === "all",
                    [styles.animationJustForCurrentPlayer]: grid.visibleTo === currentPlayerVisible,
                })}
                key={key}
            />
        );
    }

    const shouldAllowClick = grid.visibleTo !== "none" && grid.visibleTo !== currentPlayerVisible;

    const selectOption = (indexOfGrid: number, color: IValidGridColor) => () => {
        services.pickColor({ color, index: indexOfGrid as 0 | 1 | 2 | 3 | 4 });
    };

    const renderOptions = () => (
        <div className={styles.menuContainer}>
            <div className={styles.clickOptionRow} onClick={selectOption(index, "red")}>
                Red <div className={classNames(styles.clickOption, styles.red)} />
            </div>
            <div className={styles.clickOptionRow} onClick={selectOption(index, "green")}>
                G <div className={classNames(styles.clickOption, styles.green)} />
            </div>
            <div className={styles.clickOptionRow} onClick={selectOption(index, "yellow")}>
                Y <div className={classNames(styles.clickOption, styles.yellow)} />
            </div>
            <div className={styles.clickOptionRow} onClick={selectOption(index, "purple")}>
                P <div className={classNames(styles.clickOption, styles.purple)} />
            </div>
        </div>
    );

    if (shouldAllowClick) {
        return (
            <Popover className={styles.antPopoverOverride} title={renderOptions} trigger="click">
                <div
                    className={classNames(styles.singleGrid, styles.none, {
                        [styles.shouldAllowClick]: shouldAllowClick,
                    })}
                    key={key}
                />
            </Popover>
        );
    }

    return (
        <div
            className={classNames(styles.singleGrid, styles.none, { [styles.shouldAllowClick]: shouldAllowClick })}
            key={key}
        />
    );
};

export const MysteryGridFrontend: React.FC<IProps> = ({ gameState, players, services }) => {
    if (gameState === undefined) {
        return null;
    }

    if (players.allPlayers.length < 2) {
        return (
            <div className={styles.nonIdealState}>
                There are not enough players to do this puzzle. Please find a buddy!
            </div>
        );
    }

    const currentPlayerVisible = gameState.playerIdToGridMapping[players.currentPlayer.id];

    return (
        <div className={styles.gridContainer}>
            {gameState.grid.map((grid, index) => (
                <Grid currentPlayerVisible={currentPlayerVisible} grid={grid} index={index} services={services} />
            ))}
        </div>
    );
};
