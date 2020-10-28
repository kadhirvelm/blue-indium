import { IPuzzleFrontend } from "@blue-indium/puzzles";
import * as React from "react";
import { getSelectedPuzzle, setSelectedPuzzle } from "../utils/cookieStorage";
import { BlueIndiumLanding } from "./blueIndiumLanding";
import { ShowPuzzle } from "./showPuzzle";

export const MainPage: React.FC = () => {
    const [selectedPuzzle, updateSelectedPuzzleInState] = React.useState<IPuzzleFrontend | undefined>(
        getSelectedPuzzle(),
    );

    const updateSelectedPuzzle = (puzzle: IPuzzleFrontend | undefined) => {
        setSelectedPuzzle(puzzle?.puzzle.metadata.id);
        updateSelectedPuzzleInState(puzzle);
    };

    const resetSelectedPuzzle = () => {
        setSelectedPuzzle(undefined);
        updateSelectedPuzzleInState(undefined);
    };

    if (selectedPuzzle === undefined) {
        return <BlueIndiumLanding selectPuzzle={updateSelectedPuzzle} />;
    }

    return <ShowPuzzle resetSelectedPuzzle={resetSelectedPuzzle} selectedPuzzle={selectedPuzzle} />;
};
