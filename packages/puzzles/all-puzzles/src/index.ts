import { ICompletePlugin } from "@blue-indium/api";
import _ from "lodash";
import { CompletedPuzzles } from "./utils/completedPuzzles";

export interface IPuzzleBackend {
    path: string;
    packageName: string;
    puzzle: Pick<ICompletePlugin<any, any, any>, "backend" | "initialState" | "metadata">;
}

export const PuzzlesBackend: { [puzzleId: string]: IPuzzleBackend } = _.keyBy(
    CompletedPuzzles.map(puzzleData => {
        const backendPuzzle = {
            ...puzzleData,
            puzzle: _.pick(puzzleData.puzzle, ["backend", "initialState", "metadata"]),
        };

        return backendPuzzle;
    }),
    puzzleData => puzzleData.puzzle.metadata.id,
);

export interface IPuzzleFrontend {
    packageName: string;
    puzzle: Pick<ICompletePlugin<any, any, any>, "frontend" | "metadata" | "socketService">;
}

export const PuzzlesFrontend: { [puzzleId: string]: IPuzzleFrontend } = _.keyBy(
    CompletedPuzzles.map(puzzleData => {
        const frontendPuzzle = {
            packageName: puzzleData.packageName,
            puzzle: _.pick(puzzleData.puzzle, ["frontend", "metadata", "socketService"]),
        };

        return frontendPuzzle;
    }),
    puzzleData => puzzleData.puzzle.metadata.id,
);
