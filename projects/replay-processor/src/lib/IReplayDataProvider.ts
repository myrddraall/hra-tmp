import { ReplayData } from './ReplayData';

export interface IReplayDataProvider{
    readonly replayData:Promise<ReplayData>;
}