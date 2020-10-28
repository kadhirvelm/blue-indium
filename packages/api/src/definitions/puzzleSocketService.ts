import {
    IFromServerEvents,
    IFromServerSingleEvent,
    instantiateFromServerEvent,
    instantiateToServerEvent,
    IToServerEvents,
    IToServerSingleEvent,
} from "../common/genericSocket";
import { IPlayer } from "../types/puzzle";

export interface IPlayerToServerTypes {
    resetPuzzle: {};
}

interface IPlayerToServer extends IToServerEvents {
    resetPuzzle: IToServerSingleEvent<IPlayerToServerTypes["resetPuzzle"]>;
}

export const PlayerToServer: IPlayerToServer = {
    resetPuzzle: instantiateToServerEvent<{}>("resetPuzzle"),
};

export interface IInfrastructureToServer extends IToServerEvents {
    onConnect: IToServerSingleEvent<{ playerInformation: IPlayer }>;
}

export const InfrastructureToServer: IInfrastructureToServer = {
    onConnect: instantiateToServerEvent<{ playerInformation: IPlayer }>("onConnect"),
};

export interface IFromServerToPlayer extends IFromServerEvents {
    onUpdateGameState: IFromServerSingleEvent<{ gameState: any }>;
}

export const FromServerToPlayer: IFromServerToPlayer = {
    onUpdateGameState: instantiateFromServerEvent<{ gameState: any }>("onUpdateGameState"),
};
