import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';
import { ISStatGameEventData } from './ISStatGameEventData';
export interface ISStatGameEvent extends IReplayTrackerEvent {
    readonly _event: 'NNet.Replay.Tracker.SStatGameEvent';
    readonly m_eventName: string;
    readonly m_fixedData?: ISStatGameEventData<number>[];
    readonly m_intData?: ISStatGameEventData<number>[];
    readonly m_stringData?: ISStatGameEventData<string>[];
}
export function isSStatGameEvent(obj: any): obj is ISStatGameEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SStatGameEvent';
}
export function isPeriodicXPBreakdownSStatGameEvent(obj: any): obj is ISStatGameEvent {
    return isSStatGameEvent(obj) && obj.m_eventName === 'PeriodicXPBreakdown';
}
export function isEndOfGameXPBreakdownSStatGameEvent(obj: any): obj is ISStatGameEvent {
    return isSStatGameEvent(obj) && obj.m_eventName === 'EndOfGameXPBreakdown';
}
export function isGameStartSStatGameEvent(obj: any): obj is ISStatGameEvent {
    return isSStatGameEvent(obj) && obj.m_eventName === 'GameStart';
}
