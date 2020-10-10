export interface ISelectPuzzle {
    id: string;
    metadata: {
        description?: string;
        difficulty?: string;
        minimumPlayers?: number;
        recommendedPlayers?: number;
    };
    name: string;
    rid: string;
}
