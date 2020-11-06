import { IPuzzlePlugin } from "@blue-indium/api";
import * as React from "react";
import { SampleComponent } from "./components/sampleComponent";
import { IGameState, IInternalState, ISocketService } from "./types";

export const PuzzleTemplate: IPuzzlePlugin<IGameState, IInternalState, ISocketService> = {
    backend: {
        toggleTreasureChest: payload => {
            return {
                gameState: {
                    isTreasureChestOpen: payload.isOpen,
                    hasSolvedPuzzle: true,
                },
            };
        },
    },
    frontend: (gameState, services) => {
        return <SampleComponent gameState={gameState} services={services} />;
    },
    initialState: {
        initialGameState: { isTreasureChestOpen: false },
        initialInternalState: {},
    },
    metadata: {
        id: "puzzle-template",
        name: "Puzzle Template",
        description: "This is the template puzzle.",
        difficulty: "Trivial",
        minimumPlayers: 1,
        recommendedPlayers: 1,
    },
};
