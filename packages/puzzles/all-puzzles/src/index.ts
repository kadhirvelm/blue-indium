import { IPuzzlePlugin } from "@blue-indium/api";
import { PuzzleTemplate } from "@blue-indium/puzzle-template";
import { join } from "path";
import _ from "lodash";

const Puzzles: Array<{ puzzle: IPuzzlePlugin<any, any, any>; path: string; packageName: string }> = [
    {
        puzzle: PuzzleTemplate,
        path: join(process.cwd(), "../puzzles/puzzle-template"),
        packageName: encodeURIComponent("@blue-indium/puzzle-template"),
    },
];

export interface IPuzzleBackend {
    path: string;
    packageName: string;
    puzzle: Pick<IPuzzlePlugin<any, any, any>, "backend" | "initialState" | "metadata" | "socketService">;
}

export const PuzzlesBackend: { [puzzleId: string]: IPuzzleBackend } = _.keyBy(
    Puzzles.map(puzzleData => {
        const backendPuzzle = {
            ...puzzleData,
            puzzle: _.pick(puzzleData.puzzle, ["backend", "initialState", "metadata", "socketService"]),
        };

        return backendPuzzle;
    }),
    puzzleData => puzzleData.puzzle.metadata.id,
);

export interface IPuzzleFrontend {
    packageName: string;
    puzzle: Pick<IPuzzlePlugin<any, any, any>, "frontend" | "metadata" | "socketService">;
}

export const PuzzlesFrontend: { [puzzleId: string]: IPuzzleFrontend } = _.keyBy(
    Puzzles.map(puzzleData => {
        const frontendPuzzle = {
            packageName: puzzleData.packageName,
            puzzle: _.pick(puzzleData.puzzle, ["frontend", "metadata", "socketService"]),
        };

        return frontendPuzzle;
    }),
    puzzleData => puzzleData.puzzle.metadata.id,
);
