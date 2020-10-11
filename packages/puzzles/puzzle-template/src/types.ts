export interface IGameState {
    isTreasureChestOpen: boolean;
}

export interface IInternalState {}

export interface ISocketService {
    toggleTreasureChest: { isOpen: boolean };
}
