import * as linq from 'linq';
import { ISStatGameEventData } from './ISStatGameEventData';


export function getSStatValue<T>(from: ISStatGameEventData<T>[], key: string, asFloat: boolean = false): T {
    if (from) {
        var r = linq.from(from).singleOrDefault(_ => _.m_key === key);
        if (r) {
            if (asFloat && typeof r.m_value === 'number') {
                return <T><any>(r.m_value / 4096);
            }
            return r.m_value;
        }
    }
    return undefined;
}
export function getSStatValueArray<T>(from: ISStatGameEventData<T>[], key: string, asFloat: boolean = false): T[] {
    if (from) {
        const r = linq.from(from).where(_ => _.m_key === key).toArray();
        const result = [];
        if (r) {
            for (let i = 0; i < r.length; i++) {
                const item = r[i];
                if (asFloat && typeof item.m_value === 'number') {
                    result.push(<T><any>(item.m_value / 4096));
                }
                else {
                    result.push(item.m_value);
                }
            }
            return result;
        }
    }
    return [];
}
