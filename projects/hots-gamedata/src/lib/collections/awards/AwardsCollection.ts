import { Cache } from 'angular-worker-proxy';
import linq from 'linq';
import { HeroesDataApi } from '../../apis/HeroesToolChest/heroes-data/api';
import { Collection } from '../Collection';
import { IMatchAward } from './models/IMatchAward';

export class AwardsCollection extends Collection<IMatchAward> {
    private apiData: HeroesDataApi;
    // private gameStrings: IGameStrings;

    @Cache()
    public async initialize(): Promise<void> {
        this.apiData = HeroesDataApi.getVersion(this.db.version, this.db.lang);
        //this.gameStrings = (await HeroesDataApi.getVersion(this.db.version, 'enus').getGameStrings()).gamestrings;
        const gamestrings = (await this.apiData.getGameStrings()).gamestrings;
        const awards = await this.apiData.getMatchAwards();

        this.records = [];
        for (const key in awards) {
            if (awards.hasOwnProperty(key)) {
                const awardData = awards[key];
                this.records.push({
                    id: key,
                    gameLink: awardData.gameLink,
                    tag: awardData.tag,
                    mvpScreenIcon: awardData.mvpScreenIcon,
                    scoreScreenIcon: awardData.scoreScreenIcon,
                    name: gamestrings.award.name[key],
                    description: gamestrings.award.description[key],
                });
            }
        }
    }

    public get awards() {
        return (async () => {
            await this.initialize();
            return this.records;
        })();
    }

    public get awardsQ() {
        return (async () => {
            await this.initialize();
            return linq.from(this.records);
        })();
    }

    public async getAward(id: string) {
        return (await this.awardsQ).where(_ => _.id === id).firstOrDefault();
    }
    public async getAwardByLink(link: string) {
        return (await this.awardsQ).where(_ => _.gameLink === link).firstOrDefault();
    }
    public async getAwardByTag(tag: string) {
        return (await this.awardsQ).where(_ => _.tag === tag).firstOrDefault();
    }

}