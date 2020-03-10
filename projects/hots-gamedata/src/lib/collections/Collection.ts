import { IRecord } from './IRecord';
import { HotsDB } from '../db/HotSDB';
import * as linq from 'linq';

export abstract class Collection<TRecord extends IRecord>{
    protected records: TRecord[] = [];

    public get query(): linq.IEnumerable<TRecord> {
        return linq.from(this.records);
    }

    constructor(protected readonly db: HotsDB) { }
    public abstract initialize(): Promise<void>;
}
