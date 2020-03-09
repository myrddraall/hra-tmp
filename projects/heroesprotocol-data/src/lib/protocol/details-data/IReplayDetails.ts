import { IReplayFile } from '../base/index';
import { IReplayDetailsPlayer } from './IReplayDetailsPlayer';
export interface IReplayDetails {
    readonly m_cacheHandles: string[];
    readonly m_defaultDifficulty: number;
    readonly m_difficulty: string;
    readonly m_gameSpeed: number;
    readonly m_isBlizzardMap: boolean;
    readonly m_mapFileName: string;
    readonly m_miniSave: boolean;
    readonly m_modPaths: null;
    readonly m_playerList: IReplayDetailsPlayer[];
    readonly m_restartAsTransitionMap: boolean;
    readonly m_thumbnail: IReplayFile;
    readonly m_timeLocalOffset: number;
    readonly m_timeUTC: number;
    readonly m_title: string;
}
