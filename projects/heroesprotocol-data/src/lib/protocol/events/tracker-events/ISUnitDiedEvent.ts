import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';
export interface ISUnitDiedEvent extends IReplayTrackerEvent {
    readonly _event: 'NNet.Replay.Tracker.SUnitDiedEvent';
    readonly m_killerPlayerId: number;
    readonly m_unitTagIndex: number;
    readonly m_unitTagRecycle: number;
    readonly m_killerUnitTagIndex: number;
    readonly m_killerUnitTagRecycle: number;
    readonly m_x: number;
    readonly m_y: number;
}
export function isSUnitDiedEvent(obj: any): obj is ISUnitDiedEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SUnitDiedEvent';
}
