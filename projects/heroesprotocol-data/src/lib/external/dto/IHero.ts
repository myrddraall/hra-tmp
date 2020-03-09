import { ITalents } from './ITalent';
import { IAbilities } from './IAbility';

export interface IHero {
    verion?:string;
    id: string | number;
    shortName: string;
    attributeId: string;
    cHeroId: string;
    cUnitId: string;
    name: string;
    icon: string;
    role: string;
    expandedRole: string;
    type: string;
    releaseDate: string;
    releasePatch: string;
    tags: string[];
    abilities: IAbilities;
    talents: ITalents;
}
