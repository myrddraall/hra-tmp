import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';

export interface ISHeroBannedEvent extends IReplayTrackerEvent {
    readonly _event: 'NNet.Replay.Tracker.SHeroBannedEvent';
    readonly m_controllingTeam: number;
    readonly m_hero: string;
}
export function isSHeroBannedEvent(obj: any): obj is ISHeroBannedEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SHeroBannedEvent';
}
