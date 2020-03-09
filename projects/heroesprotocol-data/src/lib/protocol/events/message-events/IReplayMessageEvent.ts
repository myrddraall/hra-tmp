
import { MessageEventTypes } from './MessageEventTypes';
import { IReplayGameEvent, isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
export interface IReplayMessageEvent extends IReplayGameEvent {
}
export function isIReplayMessageEvent(obj: any): obj is IReplayMessageEvent {
    return isIReplayGameEvent(obj) && MessageEventTypes.indexOf(obj._event) !== -1;
}