import { isIReplayTrackerEvent, IReplayTrackerEvent } from '../replay-events/IReplayTrackerEvent';
export interface ISHeroPickedEvent extends IReplayTrackerEvent {
    readonly _event: 'NNet.Replay.Tracker.SHeroPickedEvent';
    readonly m_controllingPlayer: number;
    readonly m_hero: string;
}
export function isSHeroPickedEvent(obj: any): obj is ISHeroPickedEvent {
    return isIReplayTrackerEvent(obj) && obj._event === 'NNet.Replay.Tracker.SHeroPickedEvent';
}
