import { instantiateToServerEvent, IPuzzlePlugin } from "@blue-indium/api";
import * as React from "react";
import { SampleComponent } from "./components/sampleComponent";
import { IGameState, IInternalState, ISocketService } from "./types";

export const PuzzleOne: IPuzzlePlugin<IGameState, IInternalState, ISocketService> = {
    backend: {
        openTreasureChest: (_payload, state) => {
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    hasTreasureChestBeenOpened: true,
                },
            };
        },
    },
    frontend: (gameState, services) => {
        return <SampleComponent gameState={gameState} services={services} />;
    },
    initialState: {
        initialGameState: { hasTreasureChestBeenOpened: false },
        initialInternalState: {},
    },
    metadata: {
        id: "puzzle-one",
        name: "Puzzle one",
    },
    socketService: {
        openTreasureChest: instantiateToServerEvent("openTreasureChest"),
    },
};
