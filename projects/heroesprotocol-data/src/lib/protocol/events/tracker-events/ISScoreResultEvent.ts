import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';
import { IKeyValueArray } from './IKeyValueArray';
import { IScoreResult } from './IScoreResult';
export interface ISScoreResultEvent extends IReplayTrackerEvent {
    readonly m_instanceList: IKeyValueArray<IScoreResult>[];
}
export function isSScoreResultEvent(obj: any): obj is ISScoreResultEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SScoreResultEvent';
}
