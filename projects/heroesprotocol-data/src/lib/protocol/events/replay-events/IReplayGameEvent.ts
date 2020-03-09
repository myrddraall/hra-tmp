import { IReplayUserEvent } from './IReplayUserEvent';
import { isIReplayEvent } from './IReplayEvent';
export interface IReplayGameEvent extends IReplayUserEvent {
}
export function isIReplayGameEvent(obj: any): obj is IReplayGameEvent {
    return isIReplayEvent(obj) && obj._event.indexOf('NNet.Game.') === 0;
}
