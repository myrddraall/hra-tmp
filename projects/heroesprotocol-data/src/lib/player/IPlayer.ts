export enum PlayerType {
    UNUSED,
    PLAYER,
    OBSERVER,
    AI
}

export interface IPlayerLoadout{
    announcer:string;
    
}

export interface IPlayer {
    type: PlayerType;

}