import * as React from "react";
import { PuzzlesFrontend, IPuzzleFrontend } from "@blue-indium/puzzles";
import { dynamicallyImportCSS } from "@blue-indium/api";
import { Button } from "antd";
import styles from "./blueIndiumLanding.module.scss";

interface IProps {
    selectPuzzle: (puzzle: IPuzzleFrontend) => void;
}

export const BlueIndiumLanding: React.FC<IProps> = ({ selectPuzzle }) => {
    React.useEffect(() => {
        dynamicallyImportCSS("components");
    }, []);

    const selectPuzzleCurried = (puzzle: IPuzzleFrontend) => () => selectPuzzle(puzzle);

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
                <Button onClick={selectPuzzleCurried(puzzle)}>Select puzzle</Button>
            </div>
        );
    };

    const renderAvailablePuzzles = () => {
        const allPuzzles = Object.values(PuzzlesFrontend);

        return allPuzzles
            .sort((a, b) => a.puzzle.metadata.name.localeCompare(b.puzzle.metadata.name))
            .map(renderSinglePuzzle);
    };

    return (
        <div className={styles.mainPage}>
            <span className={styles.title}>Welcome to Blue Indium</span>
            <div className={styles.puzzleContainer}>{renderAvailablePuzzles()}</div>
        </div>
    );
};
