import express from "express";
import { PuzzlesBackend } from "@blue-indium/puzzles";

export function addPuzzleCSS(app: express.Express) {
    Object.values(PuzzlesBackend).forEach(puzzle => {
        app.get(`/${puzzle.packageName}.css`, (_req, res) => {
            res.sendFile(`${puzzle.path}/dist/${puzzle.packageName}.css`);
        });
    });
}
