import { IPuzzleFrontend, PuzzlesFrontend } from "@blue-indium/puzzles";
import Cookies from "js-cookie";

const KEY = "Blue-indium-selected-puzzle-id";
const DEFAULT_VALUE = "None";

export function setSelectedPuzzle(selectedPuzzleId: string | undefined) {
    Cookies.set(KEY, selectedPuzzleId ?? DEFAULT_VALUE, { expires: 1 });
}

export function getSelectedPuzzle(): IPuzzleFrontend | undefined {
    const id = Cookies.get(KEY);
    if (id === undefined || id === DEFAULT_VALUE) {
        return undefined;
    }

    return PuzzlesFrontend[id];
}
