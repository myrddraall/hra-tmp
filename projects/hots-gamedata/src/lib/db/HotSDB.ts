// tslint:disable:variable-name
import { HeroesCollection } from '../collections/HeroesCollection';
import { GameVersion } from 'heroesprotocol-data/lib';

export class HotsDB {
    private static _cache: Map<string, HotsDB> = new Map();
    private _heroes: HeroesCollection;
    private _initialized: Promise<HotsDB>;

    public static getVersion(version: GameVersion, lang: string = 'enUS'): Promise<HotsDB> {
        const key = `${lang}|${version.toString()}`;
        if (!HotsDB._cache.has(key)) {
            const db = new HotsDB(version, lang);
            HotsDB._cache.set(key, db);
        }
        return HotsDB._cache.get(key).initialize();
    }


    private constructor(
        public readonly version: GameVersion,
        public readonly lang: string,
    ) {
        this._heroes = new HeroesCollection(this);
    }

    private initialize(): Promise<HotsDB> {
        if (this._initialized) {
            return this._initialized;
        }
        return this._initialized = new Promise(async (res, rej) => {
            await this._heroes.initialize();
            res(this);
        });
    }

    public get heroes(): Promise<HeroesCollection> {
        return (async () => {
            await this.initialize();
            return this._heroes;
        })();
    }
}
