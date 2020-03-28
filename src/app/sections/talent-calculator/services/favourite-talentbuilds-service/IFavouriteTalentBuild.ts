import { GameVersion } from 'heroesprotocol-data';

export interface IFavouriteTalentBuild {
    hero: string;
    build: string;
    name: string;
    gameVersion?:GameVersion;
    lastUpdated: Date;
    description: string;
}