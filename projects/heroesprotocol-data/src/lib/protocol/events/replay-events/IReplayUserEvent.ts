import { IReplayEvent, isIReplayEvent } from './IReplayEvent';
export interface IReplayUserEvent extends IReplayEvent {
    readonly _userid: {
        m_userId: number;
    };
}
export function isIReplayUserEvent(obj: any): obj is IReplayUserEvent {
    return isIReplayEvent(obj) && '_userid' in obj;
}
