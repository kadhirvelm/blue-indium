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
    completePuzzle: {};
    resetPuzzle: {};
}

interface IPlayerToServer extends IToServerEvents {
    completePuzzle: IToServerSingleEvent<IPlayerToServerTypes["completePuzzle"]>;
    resetPuzzle: IToServerSingleEvent<IPlayerToServerTypes["resetPuzzle"]>;
}

export const PlayerToServer: IPlayerToServer = {
    completePuzzle: instantiateToServerEvent<{}>("completePuzzle"),
    resetPuzzle: instantiateToServerEvent<{}>("resetPuzzle"),
};

export interface IInfrastructureToServer extends IToServerEvents {
    onConnect: IToServerSingleEvent<{ playerInformation: IPlayer }>;
}

export const InfrastructureToServer: IInfrastructureToServer = {
    onConnect: instantiateToServerEvent<{ playerInformation: IPlayer }>("onConnect"),
};

export interface IFromServerToPlayer extends IFromServerEvents {
    onUpdateGameState: IFromServerSingleEvent<{ gameState: any; connectedPlayers: IPlayer[] }>;
}

export const FromServerToPlayer: IFromServerToPlayer = {
    onUpdateGameState: instantiateFromServerEvent<{ gameState: any; connectedPlayers: IPlayer[] }>("onUpdateGameState"),
};
