import { Namespace, Socket as ServerSocket } from "socket.io";
import * as ClientSocket from "socket.io-client";
import { ISocketService } from "../common/genericSocket";

export interface ISocketToServer {
    fromClient: {};
    toServer: {};
}

export interface IServerToSocket {
    toClient: {};
    fromServer: {};
}

export const GameSocketService: ISocketService<
    ISocketToServer["fromClient"],
    IServerToSocket["toClient"],
    ISocketToServer["toServer"],
    IServerToSocket["fromServer"]
> = {
    backend: {
        fromClient: (_socket: ServerSocket) => ({}),
        toClient: (_socket: ServerSocket | Namespace) => ({}),
    },
    frontend: {
        toServer: (_socket: typeof ClientSocket.Socket) => ({}),
        fromServer: (_socket: typeof ClientSocket.Socket) => ({}),
    },
};
