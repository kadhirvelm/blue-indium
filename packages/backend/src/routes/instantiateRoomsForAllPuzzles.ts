import { PuzzlesBackend } from "@blue-indium/puzzles";
import { Server } from "http";
import SocketIO from "socket.io";
import { InstantiatePuzzle } from "./internal/instantiatePuzzle";

export function instantiateRoomsForAllPuzzles(server: Server) {
    const MainSocket = SocketIO(server, { serveClient: false });
    Object.values(PuzzlesBackend).map(puzzle => new InstantiatePuzzle(MainSocket, puzzle));
}
