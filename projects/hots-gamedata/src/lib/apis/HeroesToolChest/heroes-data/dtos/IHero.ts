import { IUnit } from './IUnit';
import { IHeroUnits } from './IHeroUnits';
export interface IHero extends IUnit {
    heroUnits: IHeroUnits[];
}
