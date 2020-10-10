import { IEndpointDefiniton, instantiateRoute, IService } from "../common";
import { ISelectPuzzle } from "../types/puzzle";

interface IPuzzleService extends IService {
    getPuzzles: IEndpointDefiniton<{}, { puzzles: ISelectPuzzle[] }>;
}

export const PuzzleService: IPuzzleService = {
    getPuzzles: instantiateRoute("get", "/puzzles/all"),
};
