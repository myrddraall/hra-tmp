import { GitHubApi } from '../../Github';
import * as linq from 'linq';
import { GameVersion } from 'heroesprotocol-data';
import { IHeroDataSet } from './dtos';
import { Cache } from 'angular-worker-proxy'
import { IGameStringsFile } from './dtos/IGameStrings';
import { IMatchAwardsDTO } from './dtos/IMatchAwardData';
// @dynamic
export class HeroesDataApi {

    private static git: GitHubApi = new GitHubApi('HeroesToolChest', 'heroes-data');
    // tslint:disable-next-line:variable-name
    private static _cache: Map<string, HeroesDataApi> = new Map();
    // tslint:disable-next-line:variable-name
    private _versions: Promise<{ version: string, value: GameVersion }[]>;
    // tslint:disable-next-line:variable-name
    private _dataVersion: Promise<{ version: string, value: GameVersion }>;
    // tslint:disable-next-line:variable-name
    private _gamestringVersion: Promise<{ version: string, value: GameVersion }>;

    public static getVersion(version?: GameVersion | 'latest', lang: string = 'enus'): HeroesDataApi {
        const key = `${lang}|${(version ? version.toString() : 'latest')}`;
        if (!HeroesDataApi._cache.has(key)) {
            const db = new HeroesDataApi(version, lang);
            HeroesDataApi._cache.set(key, db);
        }
        return HeroesDataApi._cache.get(key);
    }

    public static get versions(): Promise<{ version: string, value: GameVersion }[]> {
        return (async () => {
            const dir = await HeroesDataApi.git.ls('heroesdata');
            return linq.from(dir)
                .select(_ => ({
                    version: _.name,
                    value: new GameVersion(_.name)
                }))
                .orderBy(_ => _.value)
                .toArray();
        })();
    }

    private static getBestVersion(version: GameVersion | 'latest'): Promise<{ version: string, value: GameVersion }[]> {
        return (async () => {

            const versions = await this.versions;
            let bestVersion: { version: string, value: GameVersion }[];
            if(version === 'latest' || version === undefined){
                const v = versions[versions.length -1];
                bestVersion = [
                    v,
                    v
                ];
            }else{
                const higherVersions = linq.from(versions).where(_ => _.value.build >= version.build).toArray();
                const bv = higherVersions.length === 0 ? versions[versions.length - 1] : higherVersions[0];
                bestVersion = [
                    bv,
                    bv
                ];
            }

            const hdp = await HeroesDataApi.git.readJson(`heroesdata/${bestVersion[0].version}/.hdp.json`);
            if (hdp.duplicate) {
                bestVersion[0] = hdp.duplicate.data
                    ? { version: hdp.duplicate.data, value: new GameVersion(hdp.duplicate.data) }
                    : bestVersion[0];
                bestVersion[1] = hdp.duplicate.gamestring
                    ? { version: hdp.duplicate.gamestring, value: new GameVersion(hdp.duplicate.gamestring) }
                    : bestVersion[1];
            }

            return bestVersion;
        })();
    }

    private constructor(public readonly version?: GameVersion | 'latest', public readonly lang: string = 'enus') {
        this._versions = HeroesDataApi.getBestVersion(version);
    }

    public get dataVersion(): Promise<{ version: string, value: GameVersion }> {
        if (!this._dataVersion) {
            this._dataVersion = (async () => {
                return (await this._versions)[0];
            })();
        }
        return this._dataVersion;
    }


    public get gamestringVersion(): Promise<{ version: string, value: GameVersion }> {
        if (!this._gamestringVersion) {
            this._gamestringVersion = (async () => {
                return (await this._versions)[1];
            })();
        }
        return this._gamestringVersion;
    }

    @Cache()
    private getVersionUrl(ver: { version: string, value: GameVersion }, path: string): string {
        return `heroesdata/${ver.version}` + (path ? path : '');
    }

    private get dataBaseDir(): Promise<string> {
        return (async () => {
            this.getVersionUrl(await this.dataVersion, '/data');
            return this.getVersionUrl(await this.dataVersion, '/data');
        })();
    }

    private get gamestringBaseDir(): Promise<string> {
        return (async () => {
            return this.getVersionUrl(await this.gamestringVersion, '/gamestrings');
        })();
    }

    private read<T = any>(filepath: string): Promise<T> {
        return HeroesDataApi.git.readJson(filepath);
    }

    private async readGameStrings(): Promise<IGameStringsFile> {
        const base = await this.gamestringBaseDir;
        const ver = await this.gamestringVersion;
        return this.read(`${base}/gamestrings_${ver.value.build}_${this.lang}.json`);
    }

    private async readData<T = any>(id: string): Promise<T> {
        const base = await this.dataBaseDir;
        const ver = await this.dataVersion;
        return this.read(`${base}/${id}_${ver.value.build}_localized.json`);
    }

    public getHeroes(): Promise<IHeroDataSet> {
        return this.readData('herodata');
    }

    public getMatchAwards(): Promise<IMatchAwardsDTO> {
        return this.readData('matchawarddata');
    }

    @Cache()
    public getGameStrings(): Promise<IGameStringsFile> {
        try{
            console.time(`getGameStrings`);
            return this.readGameStrings();
        }finally{
            console.timeEnd(`getGameStrings`);
        }
    }
}
