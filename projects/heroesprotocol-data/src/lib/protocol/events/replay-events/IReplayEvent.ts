
// tslint:disable:no-empty-interface
export interface IReplayEvent {
    readonly _event: string;
    readonly _eventid: number;
    readonly _gameloop: number;
    readonly _bits: number;
} 

export function isIReplayEvent(obj: any): obj is IReplayEvent {
    return '_event' in obj && obj._event.indexOf('NNet.') === 0;
}
