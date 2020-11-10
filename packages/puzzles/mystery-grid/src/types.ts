export type GridKey = "a" | "b";

export type IValidGridColor = "red" | "green" | "yellow" | "purple";

export interface IValidGrid {
    color: IValidGridColor;
    visibleTo: GridKey | "all" | "none";
}

export interface IGameState {
    grid: [IValidGrid, IValidGrid, IValidGrid, IValidGrid, IValidGrid];
    playerIdToGridMapping: { [playerId: string]: GridKey };
}

export interface IInternalState {}

export interface ISocketService {
    pickColor: { color: IValidGridColor; index: 0 | 1 | 2 | 3 | 4 };
}
