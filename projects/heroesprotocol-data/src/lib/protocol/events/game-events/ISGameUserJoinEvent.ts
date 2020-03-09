import { IReplayGameEvent, isIReplayGameEvent } from '../replay-events/IReplayGameEvent';

export interface ISGameUserJoinEvent extends IReplayGameEvent {
    m_clanLogo: string;
    m_clanTag: string;
    m_hijack: boolean;
    m_hijackCloneGameUserId: number;
    m_name: string;
    m_observe: number;
    m_toonHandle: string;
}

export function isSGameUserJoinEvent(obj: any): obj is ISGameUserJoinEvent {
    return isIReplayGameEvent(obj) && obj._event === 'NNet.Game.SGameUserJoinEvent';
}
