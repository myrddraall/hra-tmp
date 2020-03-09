import { isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
import { IReplayMessageEvent } from './IReplayMessageEvent';
export interface ISReconnectNotifyMessage extends IReplayMessageEvent {
    readonly _event: 'NNet.Game.SReconnectNotifyMessage';
    readonly m_status: number;
}
export function isISReconnectNotifyMessage(obj: any): obj is ISReconnectNotifyMessage {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SReconnectNotifyMessage';
}
