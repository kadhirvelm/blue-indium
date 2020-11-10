import { IPuzzlePlugin } from "@blue-indium/api";
import { join } from "path";
import { MysteryGrid } from "../../mystery-grid/dist";
import { PuzzleTemplate } from "../../puzzle-template/dist";

export const Puzzles: Array<{ puzzle: IPuzzlePlugin<any, any, any>; path: string; packageName: string }> = [
    {
        puzzle: PuzzleTemplate,
        path: join(process.cwd(), "../puzzles/puzzle-template"),
        packageName: encodeURIComponent("@blue-indium/puzzle-template"),
    },
    {
        puzzle: MysteryGrid,
        path: join(process.cwd(), "../puzzles/mystery-grid"),
        packageName: encodeURIComponent("@blue-indium/mystery-grid"),
    },
];
