import { IReplayColor } from '../base/index';
import { IReplayDetailsToon } from './IReplayDetailsToon';
export interface IReplayDetailsPlayer {
    readonly m_color: IReplayColor;
    readonly m_control: number;
    readonly m_handicap: number;
    readonly m_hero: string;
    readonly m_name: string;
    readonly m_observe: number;
    readonly m_race: string;
    readonly m_result: number;
    readonly m_teamId: number;
    readonly m_toon: IReplayDetailsToon;
    readonly m_workingSetSlotId: number;
}
