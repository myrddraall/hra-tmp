import { IRatings, IPortraits } from './IHero';

export interface IBasicHeroModel {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    name: string;
    role: string;
    portraits: IPortraits;
    expandedRole: string;
    type: string;
    releaseDate: string;
    tags: string[];
    ratings: IRatings;
    rarity: string;
    franchise: string;
    gender: string;
    searchText: string;
}


