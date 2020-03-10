import { Collection } from './Collection';
import { HeroesDataApi } from '../apis/HeroesToolChest/heroes-data/api';
import { IHero } from '../apis/HeroesToolChest/heroes-data/dtos';

export interface IHeroRecord extends IHero {
    id: string;
    heroId: string;
    shortName: string;
}

export class HeroesCollection extends Collection<IHeroRecord> {

    private api: HeroesDataApi;


    public async getHeroIds(): Promise<string[]> {
        return this.query.select(_ => _.id).toArray();
    }

    public async getHero(id: string): Promise<IHeroRecord> {
        return this.query.first(_ => _.id === id);
    }

    /*
        public getHeroById(id: string): IHeroRecord {
            return this.query.first(_ => _.id === id);
        }

        public getHeroByUnitId(id: string): IHeroRecord {
            return this.query.first(_ => _.unitId === id);
        }

        public getHeroByUnitId(id: string): IHeroRecord {
            return this.query.first(_ => _.unitId === id);
        }

        public getHeroByAttributeId(id: string): IHeroRecord {
            return this.query.first(_ => _.attributeId === id);
        }

        public getHeroByHyperlinkId(id: string): IHeroRecord {
            return this.query.first(_ => _.hyperlinkId === id);
        }

        public getHeroByShortName(name: string): IHeroRecord {
            return this.query.first(_ => _.shortName === name);
        }
    */
    public async initialize(): Promise<void> {
        this.api = HeroesDataApi.getVersion(this.db.version, this.db.lang);
        const heroes = await this.api.getHeroes();
        this.records = [];
        for (const key in heroes) {
            if (heroes.hasOwnProperty(key)) {
                const heroData = heroes[key] as IHeroRecord;
                heroData.heroId = key;
                heroData.shortName = heroData.hyperlinkId.toLowerCase();
                heroData.id = heroData.shortName;
                this.records.push(heroData);
            }
        }
        console.log('init hero collecction');
    }
}
