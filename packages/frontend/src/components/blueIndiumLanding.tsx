import * as React from "react";
import { PuzzlesFrontend, IPuzzleFrontend } from "@blue-indium/puzzles";
import { dynamicallyImportCSS, IPlayer } from "@blue-indium/api";
import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./blueIndiumLanding.module.scss";
import { getCurrentPlayer, setCurrentPlayer, updateCurrentPlayerInCookies } from "../utils/cookieStorage";
import { RegisterPlayer } from "./registerPlayer";

interface IProps {
    selectPuzzle: (puzzle: IPuzzleFrontend) => void;
}

export const BlueIndiumLanding: React.FC<IProps> = ({ selectPuzzle }) => {
    React.useEffect(() => {
        dynamicallyImportCSS("components");
    }, []);

    const selectPuzzleCurried = (puzzle: IPuzzleFrontend) => () => selectPuzzle(puzzle);

    const [currentPlayer, updateCurrentPlayer] = React.useState<IPlayer | undefined>(getCurrentPlayer());

    const renderSinglePuzzle = (puzzle: IPuzzleFrontend) => {
        const {
            puzzle: { metadata },
        } = puzzle;

        return (
            <div className={styles.singlePuzzle} key={metadata.id}>
                <div className={styles.informationContainer}>
                    <span className={styles.puzzleTitle}>{metadata.name}</span>
                    <span className={styles.description}>{metadata.description}</span>
                    <div className={styles.otherDataContainer}>
                        <span>Difficulty: {metadata.difficulty}</span>
                        <span>Minimum: {metadata.minimumPlayers}</span>
                        <span>Recommended: {metadata.recommendedPlayers}</span>
                    </div>
                </div>
                <Button
                    disabled={currentPlayer === undefined || currentPlayer.name === ""}
                    onClick={selectPuzzleCurried(puzzle)}
                >
                    Select puzzle
                </Button>
            </div>
        );
    };

    const renderAvailablePuzzles = () => {
        const allPuzzles = Object.values(PuzzlesFrontend);

        return allPuzzles
            .sort((a, b) => a.puzzle.metadata.name.localeCompare(b.puzzle.metadata.name))
            .map(renderSinglePuzzle);
    };

    const registerNewPlayer = (newPlayer: Omit<IPlayer, "id">) => {
        const completeNewPlayer = setCurrentPlayer(newPlayer);
        updateCurrentPlayer(completeNewPlayer);
    };

    if (currentPlayer === undefined) {
        return <RegisterPlayer onRegisterPlayer={registerNewPlayer} />;
    }

    const updateLocalPlayerName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedPlayer = { ...currentPlayer, name: event.currentTarget.value };
        updateCurrentPlayerInCookies(updatedPlayer);
        updateCurrentPlayer(updatedPlayer);
    };

    return (
        <div className={styles.mainPage}>
            <span className={styles.title}>
                <span>Welcome to Blue Indium</span>
                <div className={styles.playerNameContainer}>
                    <Input
                        className={styles.inputContainer}
                        placeholder="Player name"
                        prefix={<UserOutlined />}
                        size="middle"
                        onChange={updateLocalPlayerName}
                        value={currentPlayer.name}
                    />
                </div>
            </span>
            <div className={styles.puzzleContainer}>{renderAvailablePuzzles()}</div>
        </div>
    );
};
