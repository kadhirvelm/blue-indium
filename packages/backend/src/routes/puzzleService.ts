import { Express } from "express";
import { PuzzleService } from "@blue-indium/api";

export function configurePuzzleService(app: Express) {
    const { method, endpoint, implementation } = PuzzleService.getPuzzles.backend;

    app[method](endpoint, (_, res) => {
        implementation({}, res, () => {
            return { puzzles: [] };
        });
    });
}
