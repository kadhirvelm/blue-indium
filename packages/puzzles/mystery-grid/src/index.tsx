import { IPuzzlePlugin } from "@blue-indium/api";
import * as React from "react";
import { MysteryGridFrontend } from "./components/mysteryGridFrontend";
import { GridKey, IGameState, IInternalState, ISocketService, IValidGrid } from "./types";
import { selectRandomColor } from "./utils/selectRandomColor";

const BASE_GRID = (visibleTo: "a" | "b" | "none"): IValidGrid => ({
    color: selectRandomColor(),
    visibleTo,
});

const resetGrid = (): [IValidGrid, IValidGrid, IValidGrid, IValidGrid, IValidGrid] => [
    BASE_GRID("a"),
    BASE_GRID("none"),
    BASE_GRID("none"),
    BASE_GRID("none"),
    BASE_GRID("none"),
];

export const MysteryGrid: IPuzzlePlugin<IGameState, IInternalState, ISocketService> = {
    backend: {
        onConnect: (_payload, state, players) => {
            if (state.gameState.playerIdToGridMapping[players.currentPlayer.id] !== undefined) {
                return {};
            }

            const somePlayerDesignated = (gridKey: GridKey) =>
                Object.values(state.gameState.playerIdToGridMapping).some(key => key === gridKey);

            const hasA = somePlayerDesignated("a");
            const hasB = somePlayerDesignated("b");

            if (!hasA) {
                return {
                    gameState: {
                        playerIdToGridMapping: {
                            ...state.gameState.playerIdToGridMapping,
                            [players.currentPlayer.id]: "a",
                        },
                    },
                };
            }

            if (!hasB) {
                return {
                    gameState: {
                        playerIdToGridMapping: {
                            ...state.gameState.playerIdToGridMapping,
                            [players.currentPlayer.id]: "b",
                        },
                    },
                };
            }

            return {
                gameState: {
                    playerIdToGridMapping: {
                        ...state.gameState.playerIdToGridMapping,
                        [players.currentPlayer.id]: Math.random() >= 0.5 ? "a" : "b",
                    },
                },
            };
        },
        onReset: (_payload, state) => {
            return {
                gameState: {
                    grid: resetGrid(),
                    playerIdToGridMapping: state.gameState.playerIdToGridMapping,
                },
            };
        },
        pickColor: (payload, state, players) => {
            const currentPlayerVisible = state.gameState.playerIdToGridMapping[players.currentPlayer.id];
            const grid = state.gameState.grid[payload.index];

            if (grid === undefined || grid.visibleTo === currentPlayerVisible || grid.color !== payload.color) {
                return {
                    gameState: {
                        grid: resetGrid(),
                    },
                };
            }

            const newGrid = state.gameState.grid.slice() as [
                IValidGrid,
                IValidGrid,
                IValidGrid,
                IValidGrid,
                IValidGrid,
            ];
            newGrid[payload.index].visibleTo = "all";

            if (payload.index === 4) {
                return {
                    gameState: {
                        grid: newGrid,
                        hasSolvedPuzzle: true,
                    },
                };
            }

            newGrid[payload.index + 1].color = selectRandomColor();
            newGrid[payload.index + 1].visibleTo = currentPlayerVisible;

            return {
                gameState: {
                    grid: newGrid,
                },
            };
        },
    },
    frontend: (gameState, services, players) => {
        return <MysteryGridFrontend gameState={gameState} players={players} services={services} />;
    },
    initialState: {
        initialGameState: {
            grid: resetGrid(),
            playerIdToGridMapping: {},
        },
        initialInternalState: {},
    },
    metadata: {
        id: "mystery-grid",
        name: "The mystery grid",
        description: "There are several boxes on the screen, but what do they do?",
        difficulty: "Easy",
        minimumPlayers: 2,
        recommendedPlayers: 2,
    },
};
