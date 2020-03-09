
import { UserLeaveReason } from './UserLeaveReason';
import { IReplayGameEvent, isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
export interface ISGameUserLeaveEvent extends IReplayGameEvent {
    m_leaveReason: number | UserLeaveReason;
}

export function isSGameUserLeaveEvent(obj: any): obj is ISGameUserLeaveEvent {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SGameUserLeaveEvent';
}