import { instantiateToServerEvent, IPuzzlePlugin } from "@blue-indium/api";
import * as React from "react";
import { IGameState, IInternalState, ISocketService } from "./types";
import { SampleComponent } from "./components/sampleComponent";

export const PuzzleTemplate: IPuzzlePlugin<IGameState, IInternalState, ISocketService> = {
    backend: {
        toggleTreasureChest: (payload, state) => {
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    isTreasureChestOpen: payload.isOpen,
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
    },
    socketService: {
        toggleTreasureChest: instantiateToServerEvent("toggleTreasureChest"),
    },
};
