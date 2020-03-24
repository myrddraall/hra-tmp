import { IAbilities } from './IAbilities';
import { ITalents } from './ITalents';

export interface IHero {
    id: number;
    shortName: string;
    attributeId: string;
    cHeroId: string;
    cUnitId: string;
    name: string;
    icon: string;
    role: string;
    expandedRole: string;
    type: string;
    releaseDate: Date;
    releasePatch: string;
    tags: string[];
    abilities: IAbilities;
    talents: ITalents;
}

