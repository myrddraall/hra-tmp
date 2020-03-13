import { Buffer } from 'buffer';
import { IReplayHeader } from './header-data/IReplayHeader';
import { Observable } from 'rxjs';
export interface IHeroProtocol {
    readonly version: number;
    readonly progress: Observable<{
        file: string;
        current: number,
        total: number
    }>;
    decodeReplayGameEvents(contents: Buffer): any;
    decodeReplayMessageEvents(contents: Buffer): any;
    decodeReplayTrackerEvents(contents: Buffer): any;
    decodeReplayHeader(contents: Buffer): IReplayHeader;
    decodeReplayDetails(contents: Buffer): any;
    decodeReplayInitdata(contents: Buffer): any;
    decodeReplayAttributesEvents(contents: Buffer): any;

    unitTag(unitTagIndex: number, unitTagRecycle: number): number;
    unitTagIndex(unitTag: number): number;
    unitTagRecycle(unitTag: number): number;
}