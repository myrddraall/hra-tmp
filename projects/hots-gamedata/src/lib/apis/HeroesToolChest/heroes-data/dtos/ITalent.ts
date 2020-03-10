import { ICharges } from './ICharges';
import { AbilityType } from './AbilityType';
export interface ITalent {
    nameId: string;
    buttonId: string;
    icon: string;
    abilityType: AbilityType;
    sort?: number;
    abilityTalentLinkIds?: string[];
    charges?: ICharges;
    isActive?: boolean;
    prerequisiteTalentIds?: string[];
    isQuest?: boolean;
    toggleCooldown?: number;
    isPassive?: boolean;
}
