export class HeroDataApi {
    private baseUrlHeroTalents = 'https://raw.githubusercontent.com/heroespatchnotes/heroes-talents';

    private static _cache: Map<string, HeroDataApi> = new Map();

    public static getVersion(version: string = 'master') {
        if(!HeroDataApi._cache.has(version)){
            HeroDataApi._cache.set(version, new HeroDataApi(version))
        }
        return HeroDataApi._cache.get(version);
    }

    private constructor(
        public readonly version: string
    ) {

    }


    
/*
    public async getHeroData(heroName: string, version: string = 'master') {
        const data = await this._loadHeroData(heroName, version);

    }

    private async _loadHeroData(heroName: string, version: string = 'master') {
        let url = this.buildGithubUrl(this.baseUrlHeroTalents, `/hero/${this.cleanHeroName(heroName)}.json`, version);
        let response: Response;
        try {
            response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
            if (version !== 'master') {
                return await this._loadHeroData(heroName);
            }
            throw new Error(`Could not load data for hero '${heroName}'. ${response.statusText}`)
        } catch (e) {
            if (version !== 'master') {
                return await this._loadHeroData(heroName);
            }
            throw e;
        }


    }

    private buildGithubUrl(base: string, path: string, version?: string) {
        version = version || 'master';
        return `${base}/${version}/${path}`;
    }

    private cleanHeroName(heroName: string): string {
        return heroName.toLowerCase().replace(/[^0-9a-z]/gi, '');
    }
*/
}