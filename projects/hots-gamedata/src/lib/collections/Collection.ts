import { IRecord } from './IRecord';
import { HotsDB } from '../db/HotSDB';

export abstract class Collection<TRecord extends IRecord>{
    private _records: TRecord[];

    constructor(protected readonly db: HotsDB) { }
    public abstract initialize(): Promise<void>;
}