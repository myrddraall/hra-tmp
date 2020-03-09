
import { IReplayMessageEvent } from './IReplayMessageEvent';
import { isIReplayGameEvent } from '../replay-events/IReplayGameEvent';

export interface ISChatMessage extends IReplayMessageEvent {
    readonly _event: 'NNet.Game.SChatMessage';
    readonly m_recipient: number;
    readonly m_string: string;
}
export function isISChatMessage(obj: any): obj is ISChatMessage {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SChatMessage';
}
