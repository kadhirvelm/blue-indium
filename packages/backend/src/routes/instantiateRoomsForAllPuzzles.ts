import { PuzzlesBackend } from "@blue-indium/puzzles";
import { Server } from "http";
import { InstantiatePuzzle } from "./internal/instantiatePuzzle";

export function instantiateRoomsForAllPuzzles(server: Server) {
    Object.values(PuzzlesBackend).map(puzzle => new InstantiatePuzzle(server, puzzle));
}
