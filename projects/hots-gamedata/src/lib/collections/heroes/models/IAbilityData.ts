import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';

export interface IAbilityData extends DTOs.IAbility {
    type?: string;
    subabilityOf?: string;
}

export interface ITalentData extends DTOs.ITalent {
    tier?: number;
}