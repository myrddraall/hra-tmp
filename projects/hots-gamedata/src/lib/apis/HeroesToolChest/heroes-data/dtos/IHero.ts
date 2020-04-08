import { IUnit } from './IUnit';
import { IHeroUnits } from './IHeroUnits';
import { IRatings } from './IRatings';
import { ITalents } from './ITalents';
export interface IHero extends IUnit {
    attributeId: string;
    franchise: string;
    gender: string;
    releaseDate: string;
    units: string[];
    ratings: IRatings;
    rarity: string;
    talents: ITalents;
    heroUnits: IHeroUnits[];
}
