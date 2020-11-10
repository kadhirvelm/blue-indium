import { IPlayer } from "@blue-indium/api";
import { IPuzzleFrontend, PuzzlesFrontend } from "@blue-indium/puzzles";
import Cookies from "js-cookie";
import { v4 } from "uuid";

const KEY = "blue-indium-selected-puzzle-id-v1";
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

const PLAYER_KEY = "blue-indium-player-key-v1";

export function setCurrentPlayer(player: Omit<IPlayer, "id">): IPlayer {
    const completePlayer: IPlayer = { ...player, id: v4() };
    Cookies.set(PLAYER_KEY, completePlayer, { expires: 14 });

    return completePlayer;
}

export function updateCurrentPlayerInCookies(player: IPlayer) {
    Cookies.set(PLAYER_KEY, player, { expires: 14 });
}

export function getCurrentPlayer(): IPlayer | undefined {
    const playerFromCookies = Cookies.get(PLAYER_KEY);
    if (playerFromCookies === undefined) {
        return undefined;
    }

    return JSON.parse(playerFromCookies);
}
