import { GameVersion } from 'heroesprotocol-data';

export class HeroesTalentsApi {
    // tslint:disable-next-line:variable-name
    private static _cache: Map<string, HeroesTalentsApi> = new Map();

    public static getVersion(version?: GameVersion): HeroesTalentsApi {
        const key = `${(version ? version.toString() : 'latest')}`;
        if (!HeroesTalentsApi._cache.has(key)) {
            const db = new HeroesTalentsApi(version);
            HeroesTalentsApi._cache.set(key, db);
        }
        return HeroesTalentsApi._cache.get(key);
    }

    private constructor(public readonly version?: GameVersion) {

    }
}
