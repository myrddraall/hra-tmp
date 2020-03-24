import { GameVersion } from 'heroesprotocol-data';
import { GitHubApi } from '../../Github';
import * as linq from 'linq';
import { Cache } from '../../cache.decorator';
import { IHero } from './dtos/IHero';
export class HeroesTalentsApi {
    // tslint:disable-next-line:variable-name
    private static _cache: Map<string, HeroesTalentsApi> = new Map();

    private git: GitHubApi = new GitHubApi('heroespatchnotes', 'heroes-talents');


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

    public get versions(): Promise<{ value: string, version: GameVersion }[]> {
        return (async () => {
            const tags = await this.git.listTags();
            return linq.from(tags)
                .select(_ => ({
                    value: _,
                    version: new GameVersion(_)
                }))
                .orderBy(_ => _.version.build)
                .toArray();
        })();
    }

    @Cache()
    private get bestVersion(): Promise<{ value: string, version: GameVersion }> {
        return (async () => {
            const versions = await this.versions;
            const higherVersions = linq.from(await this.versions).where(_ => _.version.build >= this.version.build).toArray();
            if (!higherVersions.length) {
                return versions[versions.length - 1];
            }
            return higherVersions[0];
        })();
    }

    private async readJson<T>(path: string): Promise<T> {
        return this.git.readJson(path, (await this.bestVersion).value);
    }

    public getHero(shortName:string):Promise<IHero>{
        return this.readJson(`hero/${shortName}.json`);
    }

}
