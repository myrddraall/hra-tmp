import { GameType } from '../MatchInfo';
import { IPlayer } from "./player/IPlayer";
export interface IMatch {
    id: string;
    mapId: string;
    type: GameType;
    gameVersion: string;
    date: string;
    localTimeZone: number;
    duration: number;
    players: IPlayer[];
    winningTeam: number;
}
