import { GitHubApi } from '../../Github';
import * as linq from 'linq';;

export interface GameVersion {
    major: number;
    minor: number;
    patch: number;
    build: number;
}



export class HeroesDataApi {

    private static _cache: Map<string, HeroesDataApi> = new Map();

    public static getVersion(version?: string, lang: string = 'enUS'): HeroesDataApi {
        const key = `${lang}|${version}`;
        if (!HeroesDataApi._cache.has(key)) {
            const db = new HeroesDataApi(version, lang);
            HeroesDataApi._cache.set(key, db);
        }
        return HeroesDataApi._cache.get(key);
    }

    private git: GitHubApi = new GitHubApi('HeroesToolChest', 'heroes-data');

    constructor(public readonly version?: string, public readonly lang: string = 'enus') {



    }



    private initialize(): Promise<void> {
        return null;
    }

    private get baseUrl():Promise<string>{
        return (async ()=>{
            const dir = await this.git.ls('/heroesdata');
            linq.from(dir).orderBy(_ => _.name);
            return '';
        })();
    }

    private callApi(filepath: string): any {
       // this.gi
    }


}