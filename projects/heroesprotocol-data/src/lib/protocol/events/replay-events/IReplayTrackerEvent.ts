import { IReplayEvent, isIReplayEvent } from './IReplayEvent';
export interface IReplayTrackerEvent extends IReplayEvent {
}
export function isIReplayTrackerEvent(obj: any): obj is IReplayTrackerEvent {
    return isIReplayEvent(obj) && obj._event.indexOf('NNet.Replay.Tracker.') === 0;
}
