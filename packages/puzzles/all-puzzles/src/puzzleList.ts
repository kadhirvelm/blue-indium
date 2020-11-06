import { IPuzzlePlugin } from "@blue-indium/api";
import { PuzzleTemplate } from "@blue-indium/puzzle-template";
import { join } from "path";

export const Puzzles: Array<{ puzzle: IPuzzlePlugin<any, any, any>; path: string; packageName: string }> = [
    {
        puzzle: PuzzleTemplate,
        path: join(process.cwd(), "../puzzles/puzzle-template"),
        packageName: encodeURIComponent("@blue-indium/puzzle-template"),
    },
];
