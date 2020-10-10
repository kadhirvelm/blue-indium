import { IAllowedTypes } from "@blue-indium/api";

export interface IGameState extends IAllowedTypes {
    hasTreasureChestBeenOpened: boolean;
}

export interface IInternalState extends IAllowedTypes {}

export interface ISocketService extends IAllowedTypes {
    openTreasureChest: {};
}
