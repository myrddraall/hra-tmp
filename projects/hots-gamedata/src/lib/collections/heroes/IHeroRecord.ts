import * as DTOs from '../../apis/HeroesToolChest/heroes-data/dtos/index';
export interface IHeroRecord extends DTOs.IHero {
    id: string;
    heroId: string;
    shortName: string;
}
