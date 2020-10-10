import { IToServerSingleEvent } from "../common/genericSocket";

export interface IPuzzleState<IGameState, IInternalState> {
    gameState: IGameState;
    internalState: IInternalState;
}

export interface IImplementedSocketServiceBackend<IGameState, IInternalState> {
    [eventName: string]: (
        payload: any,
        state: IPuzzleState<IGameState, IInternalState>,
    ) => IPuzzleState<IGameState, IInternalState>;
}

export interface IImplementedSocketServiceFrontend {
    [eventName: string]: (payload: any) => void;
}

export type IToServerEventFromSocketService<IImplementedSocketServiceFrontend> = {
    [Key in keyof IImplementedSocketServiceFrontend]: IToServerSingleEvent<any>;
};

export type IConvertToBackend<ISocketService, IGameState, IInternalState> = {
    [Key in keyof ISocketService]: (
        payload: ISocketService[Key],
        state: IPuzzleState<IGameState, IInternalState>,
    ) => IPuzzleState<IGameState, IInternalState>;
};

export type IConvertToFrontend<ISocketService> = {
    [Key in keyof ISocketService]: (payload: ISocketService[Key]) => void;
};

export interface IAllowedTypes {
    [eventName: string]: string | number | boolean | string[] | number[] | boolean[] | IAllowedTypes;
}

export interface IPuzzlePlugin<
    IGameState extends IAllowedTypes = {},
    IInternalState extends IAllowedTypes = {},
    ISocketService extends IAllowedTypes = {}
> {
    backend: IConvertToBackend<ISocketService, IGameState, IInternalState>;
    frontend: (
        gameState: IGameState | undefined,
        socketService: IConvertToFrontend<ISocketService>,
    ) => React.ReactElement | JSX.Element;
    initialState: {
        initialGameState: IGameState;
        initialInternalState: IInternalState;
    };
    metadata: {
        /** Requires properties */
        id: string;
        name: string;
        /** Optional properties */
        description?: string;
        difficulty?: string;
        minimumPlayers?: number;
        recommendedPlayers?: number;
    };
    socketService: IToServerEventFromSocketService<ISocketService>;
}
