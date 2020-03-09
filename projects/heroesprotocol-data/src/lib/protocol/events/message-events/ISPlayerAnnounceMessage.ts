import { isIReplayGameEvent } from '../replay-events/IReplayGameEvent';
import { IAbility } from '../../base/index';
import { IReplayMessageEvent } from './IReplayMessageEvent';
export interface ISPlayerAnnounceMessage extends IReplayMessageEvent {
    readonly _event: 'NNet.Game.SPlayerAnnounceMessage';
    readonly m_announceLink: number;
    readonly m_announcement: {
        Ability: IAbility;
    };
    readonly m_otherUnitTag: number;
    readonly m_unitTag: number;
}
export function isISPlayerAnnounceMessage(obj: any): obj is ISPlayerAnnounceMessage {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SPlayerAnnounceMessage';
}
