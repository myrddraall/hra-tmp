import { IAbilityBase } from './IAbilityBase';
export interface ITalent extends IAbilityBase{
    sort?: number;
    abilityTalentLinkIds?: string[];
    prerequisiteTalentIds?: string[];
    isQuest?: boolean;
}
