import { AbilityType } from './AbilityType';
import { ICharges } from './ICharges';

export interface IAbilityBase {
    nameId: string;
    buttonId: string;
    icon: string;
    abilityType: AbilityType;
    charges?: ICharges;
    isActive?: boolean;
    toggleCooldown?: number;
    //cooldown?: number;
    isPassive?: boolean;
}