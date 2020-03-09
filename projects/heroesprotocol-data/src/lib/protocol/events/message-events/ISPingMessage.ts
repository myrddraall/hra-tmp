import { isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
import { IReplayMessageEvent } from './IReplayMessageEvent';
export interface ISPingMessage extends IReplayMessageEvent {
    readonly _event: 'NNet.Game.SPingMessage';
    readonly m_recipient: number;
    readonly m_point: {
        x: number;
        y: number;
    };
}
export function isISPingMessage(obj: any): obj is ISPingMessage {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SPingMessage';
}
