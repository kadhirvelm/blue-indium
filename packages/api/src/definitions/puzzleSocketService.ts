import {
    IFromServerEvents,
    IFromServerSingleEvent,
    instantiateFromServerEvent,
    instantiateToServerEvent,
    IToServerEvents,
    IToServerSingleEvent,
} from "../common/genericSocket";

interface IPlayerToServer extends IToServerEvents {
    onConnect: IToServerSingleEvent<{ playerInformation: { name: string } }>;
}

export const PlayerToServer: IPlayerToServer = {
    onConnect: instantiateToServerEvent<{ playerInformation: { name: string } }>("onConnect"),
};

interface IFromServerToPlayer extends IFromServerEvents {
    onUpdateGameState: IFromServerSingleEvent<{ gameState: any }>;
}

export const FromServerToPlayer: IFromServerToPlayer = {
    onUpdateGameState: instantiateFromServerEvent<{ gameState: any }>("onUpdateGameState"),
};
