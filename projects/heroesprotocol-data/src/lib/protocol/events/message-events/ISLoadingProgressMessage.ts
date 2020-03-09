
import { IReplayMessageEvent } from './IReplayMessageEvent';
import { isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
export interface ISLoadingProgressMessage extends IReplayMessageEvent {
    readonly _event: 'NNet.Game.SLoadingProgressMessage';
    readonly m_progress: number;
}
export function isISLoadingProgressMessage(obj: any): obj is ISLoadingProgressMessage {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SLoadingProgressMessage';
}
