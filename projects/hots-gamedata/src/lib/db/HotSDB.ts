// tslint:disable:variable-name
import { HeroesCollection } from '../collections/heroes/HeroesCollection';
import { GameVersion } from 'heroesprotocol-data';
import { AwardsCollection } from '../collections/awards/AwardsCollection';

export class HotsDB {
    private static _cache: Map<string, HotsDB> = new Map();
    private _heroes: HeroesCollection;
    private _awards: AwardsCollection;
    private _initialized: Promise<HotsDB>;

    public static getVersion(version: GameVersion | 'latest', lang: string = 'enus'): Promise<HotsDB> {
        const key = `${lang}|${version.toString()}`;
        if (!HotsDB._cache.has(key)) {
            const db = new HotsDB(version, lang);
            HotsDB._cache.set(key, db);
        }
        return HotsDB._cache.get(key).initialize();
    }


    private constructor(
        public readonly version: GameVersion | 'latest',
        public readonly lang: string,
    ) {
        this._heroes = new HeroesCollection(this);
        this._awards = new AwardsCollection(this);
    }

    private initialize(): Promise<HotsDB> {
        if (this._initialized) {
            return this._initialized;
        }
        return this._initialized = new Promise(async (res, rej) => {
            await Promise.all([
                this._heroes.initialize(),
                this._awards.initialize()
            ]);
            res(this);
        });
    }

    public get heroes(): Promise<HeroesCollection> {
        return (async () => {
            await this.initialize();
            return this._heroes;
        })();
    }
    
    public get matchAwards(): Promise<AwardsCollection> {
        return (async () => {
            await this.initialize();
            return this._awards;
        })();
    }
}
