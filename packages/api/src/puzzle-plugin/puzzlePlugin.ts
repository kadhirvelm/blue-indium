import { IToServerSingleEvent } from "../common/genericSocket";
import { IPlayerToServerTypes } from "../definitions/puzzleSocketService";
import { IPlayer } from "../types";

interface IPuzzleState<IGameState, IInternalState> {
    gameState?: Partial<IGameState>;
    internalState?: Partial<IInternalState>;
}

type IAllowedType = string | number | boolean | string[] | number[] | boolean[] | undefined;

interface IAllowedTypes {
    [eventName: string]: IAllowedType | IAllowedTypes;
}

type IConvertToAllowedTypes<ISocketServiceAllowedTypes, AllowedType> = {
    [Key in keyof ISocketServiceAllowedTypes]: AllowedType;
};

/**
 * Just an implementation detail, this is one of the types that abstract the socket use away from the puzzle plugin.
 */
type IToServerEventFromSocketService<IImplementedSocketServiceFrontend> = {
    [Key in keyof IImplementedSocketServiceFrontend]: IToServerSingleEvent<any>;
};

/**
 * Backend event handling will get the typed payload of the according event name and the current state of the puzzle, both internal
 * and game state. It's expected to return the new internal and game state, which in turn will fire off an update event to all connected
 * players.
 */
export type IConvertToBackend<ISocketService, IGameState, IInternalState> = {
    [Key in keyof ISocketService]: (
        payload: ISocketService[Key],
        state: IPuzzleState<IGameState, IInternalState>,
        players: { currentPlayer: IPlayer; allConnectedPlayers: IPlayer[] },
    ) => IPuzzleState<IGameState, IInternalState>;
};

/**
 * Frontend services will get an object that has the same keys as the `ISocketService` object and will expect
 * the according key's type as a payload to fire off to the backend.
 */
export type IConvertToFrontend<ISocketService> = {
    [Key in keyof ISocketService]: (payload: ISocketService[Key]) => void;
};

/**
 * The default game state included in every puzzle.
 */
export interface IDefaultGameState {
    /**
     * By default this is false, please set this variable to true once the users have solved the puzzle. This will bring up the congratulations modal
     * and take them to select a different puzzle.
     */
    hasSolvedPuzzle: boolean;
}

/**
 * The plugin interface for a blue-indium puzzle. The goal here is to handle all the socket implementations in the background, leaving
 * the developer to focus solely on creating their puzzle.
 *
 * @param IGameState presents the overall game state. Whenever a backend event fires, the latest game state will come through to the frontend, meaning this is shared between the backend and the users.
 * @param IInternalState the internal game state, local only to the backend
 * @param ISocketService the eventNames and payloads the user can fire off and that the backend will handle
 */
export interface IPuzzlePlugin<
    IGameState extends IConvertToAllowedTypes<IGameState, IAllowedType | IAllowedTypes> = {},
    IInternalState extends IConvertToAllowedTypes<IInternalState, IAllowedType | IAllowedTypes> = {},
    ISocketService extends IConvertToAllowedTypes<ISocketService, IAllowedTypes> = {}
> {
    /**
     * The backend event handling. The events come from `ISocketService` and will get the type safe payload and the current state (both the game state and the internal state). It should return the new state of the
     * puzzle, both game state and internal state, which will in turn fire off an update event to all connected players.
     */
    backend: IConvertToBackend<ISocketService, IGameState & IDefaultGameState, IInternalState>;
    /**
     * The frontend display of your puzzle, this is the entry point that blue indium will access to render your puzzle. The socketService events are created
     * from `ISocketService` with all the socket implementations abstracted away so you can just focus on the typed payload.
     */
    frontend: (
        gameState: (IGameState & IDefaultGameState) | undefined,
        socketService: IConvertToFrontend<ISocketService> & IConvertToFrontend<IPlayerToServerTypes>,
    ) => React.ReactElement | JSX.Element | Promise<React.ReactElement | JSX.Element>;
    /**
     * Initializes the game state and the internal state to the puzzle. Remember the overall state is shared between all players.
     */
    initialState: {
        /**
         * The initial game state, remember this is shared with all players.
         */
        initialGameState: IGameState;
        /**
         * The initial server state of the puzzle, this is not shared with the players directly, but all players share the same internal state.
         */
        initialInternalState: IInternalState;
    };
    /**
     * Used to display helpful information to players that are selecting a puzzle to solve.
     */
    metadata: {
        /**
         * A unique identifier for your puzzle, please be sure to check the other puzzles in the `puzzles` namespace to de-conflict your puzzle-id. This is used to
         * instantiate a new socket room for your puzzle.
         */
        id: string;
        /**
         * A human readable name for your puzzle.
         */
        name: string;
        /**
         * A description of what players will be attempting to solve, or maybe a peek into the theme of your puzzle.
         */
        description?: string;
        /**
         * The overall difficulty level, ideally "easy", "medium", "hard".
         */
        difficulty?: string;
        /**
         * The absolute minimum number of players needed to solve the puzzle.
         */
        minimumPlayers?: number;
        /**
         * The recommended number of players to solve the puzzle.
         */
        recommendedPlayers?: number;
    };
}

export type ICompletePlugin<
    IGameState extends IConvertToAllowedTypes<IGameState, IAllowedType | IAllowedTypes> = {},
    IInternalState extends IConvertToAllowedTypes<IInternalState, IAllowedType | IAllowedTypes> = {},
    ISocketService extends IConvertToAllowedTypes<ISocketService, IAllowedTypes> = {}
> = IPuzzlePlugin<IGameState, IInternalState, ISocketService> & {
    /**
     * The implemented socket service, this is used to create the sockets used by the backend and frontend. Its implementation details are abstracted
     * away from the puzzle plugin.
     *
     * Use the `instantiateToServerEvent` convenience method from the API package to create new to server socket events. Be sure the name argument is the
     * exact name used in the `ISocketService` object. This is passed directly to Socket.io and is the only piece that isn't type safe.
     */
    socketService: IToServerEventFromSocketService<ISocketService>;
};
