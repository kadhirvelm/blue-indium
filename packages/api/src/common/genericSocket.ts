import SocketIOServer from "socket.io";

/** To server from client */

type IToServerBackend<Payload> = (
    socket: SocketIOServer.Socket,
) => { onEvent: (callback: (payload: Payload) => void) => void };
type IToServerFrontend<Payload> = (socket: SocketIOClient.Socket) => { sendEvent: (payload: Payload) => void };

export interface IToServerSingleEvent<Payload = any> {
    backend: IToServerBackend<Payload>;
    frontend: IToServerFrontend<Payload>;
}

export interface IToServerEvents {
    [eventName: string]: IToServerSingleEvent<any>;
}

function toServerBackendImplementation<Payload>(socket: SocketIOServer.Socket, eventName: string) {
    return {
        onEvent: (callback: (payload: Payload) => void) => {
            socket.on(eventName, callback);
        },
    };
}

function toServerFrontendImplementation<Payload>(socket: SocketIOClient.Socket, eventName: string) {
    return {
        sendEvent: (payload: Payload) => {
            socket.emit(eventName, payload);
        },
    };
}

export function instantiateToServerEvent<Payload = any>(eventName: string): IToServerSingleEvent<Payload> {
    return {
        backend: (socket: SocketIOServer.Socket) => toServerBackendImplementation<Payload>(socket, eventName),
        frontend: (socket: SocketIOClient.Socket) => toServerFrontendImplementation<Payload>(socket, eventName),
    };
}

/** From server to client */

type IFromServerBackend<Payload> = (
    socket: SocketIOServer.Socket | SocketIOServer.Namespace,
) => { sendEvent: (payload: Payload) => void };
type IFromServerFrontend<Payload> = (
    socket: SocketIOClient.Socket,
) => { onEvent: (callback: (payload: Payload) => void) => void };

export interface IFromServerSingleEvent<Payload> {
    backend: IFromServerBackend<Payload>;
    frontend: IFromServerFrontend<Payload>;
}

export interface IFromServerEvents {
    [eventName: string]: IFromServerSingleEvent<any>;
}

function fromServerBackendImplementation<Payload>(
    socket: SocketIOServer.Socket | SocketIOServer.Namespace,
    eventName: string,
) {
    return {
        sendEvent: (payload: Payload) => {
            socket.emit(eventName, payload);
        },
    };
}

function fromServerFrontendImplementation<Payload>(socket: SocketIOClient.Socket, eventName: string) {
    return {
        onEvent: (callback: (payload: Payload) => void) => {
            socket.on(eventName, callback);
        },
    };
}

export function instantiateFromServerEvent<Payload>(eventName: string): IFromServerSingleEvent<Payload> {
    return {
        backend: (socket: SocketIOServer.Socket | SocketIOServer.Namespace) =>
            fromServerBackendImplementation<Payload>(socket, eventName),
        frontend: (socket: SocketIOClient.Socket) => fromServerFrontendImplementation<Payload>(socket, eventName),
    };
}
