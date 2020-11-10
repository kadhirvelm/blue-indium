import { IPlayer } from "@blue-indium/api";

export function assertPlayerExists(currentPlayer: IPlayer | undefined): asserts currentPlayer is IPlayer {
    if (currentPlayer === undefined) {
        throw new Error(
            "Current player is not defined, yet we're trying to render a puzzle. This should not be possible.",
        );
    }
}
