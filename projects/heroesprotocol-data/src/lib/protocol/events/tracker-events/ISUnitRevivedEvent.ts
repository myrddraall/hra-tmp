import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';
export interface ISUnitRevivedEvent extends IReplayTrackerEvent {
    readonly _event: 'NNet.Replay.Tracker.SUnitRevivedEvent';
    readonly m_controlPlayerId: number;
    readonly m_unitTagIndex: number;
    readonly m_unitTagRecycle: number;
    readonly m_x: number;
    readonly m_y: number;
}
export function isSUnitRevivedEvent(obj: any): obj is ISUnitRevivedEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SUnitRevivedEvent';
}
