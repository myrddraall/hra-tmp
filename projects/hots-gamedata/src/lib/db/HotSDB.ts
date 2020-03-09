import { HeroesCollection } from '../collections/HeroesCollection';

export class HotsDB{
    private static _cache: Map<string, HotsDB> = new Map();
    
    public static getVersion(version: string = 'master', lang:string ='enUS'):Promise<HotsDB> {
        
        const key = `${lang}|${version}`;
        console.log('get ---', key);
        if(!HotsDB._cache.has(key)){
            const db = new HotsDB(version, lang);
            HotsDB._cache.set(key, db);
        }
        return HotsDB._cache.get(key).initialize();
    }

    private _heroes:HeroesCollection;
    private _initialized:Promise<HotsDB>;

    private constructor(
        public readonly version: string,
        public readonly lang: string,
    ) {
        this._heroes = new HeroesCollection(this);
    }

    private initialize():Promise<HotsDB>{
        if(this._initialized){
            return this._initialized;
        }
        return this._initialized = new Promise(async (res, rej)=>{
            await this._heroes.initialize();
            res(this);
        });
    }
}