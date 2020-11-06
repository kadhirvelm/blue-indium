import { ICompletePlugin, instantiateToServerEvent } from "@blue-indium/api";
import { Puzzles } from "../puzzleList";

/**
 * Adds the package name and the socket services.
 */
export const CompletedPuzzles: Array<{
    puzzle: ICompletePlugin<any, any, any>;
    path: string;
    packageName: string;
}> = Puzzles.map(singlePuzzle => ({
    ...singlePuzzle,
    puzzle: {
        ...singlePuzzle.puzzle,
        socketService: Object.keys(singlePuzzle.puzzle.backend)
            .map(eventName => ({ [eventName]: instantiateToServerEvent(eventName) }))
            .reduce((previous, next) => ({ ...previous, ...next }), {}),
    },
}));
