import { ICharges } from './ICharges';
import { AbilityType } from './AbilityType';
export interface IAbility {
    nameId: string;
    buttonId: string;
    icon: string;
    abilityType: AbilityType;
    charges?: ICharges;
    isActive?: boolean;
    toggleCooldown?: number;
    isPassive?: boolean;
}
