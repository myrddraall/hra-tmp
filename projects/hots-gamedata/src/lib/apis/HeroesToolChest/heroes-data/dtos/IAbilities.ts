import { IAbility } from './IAbility';
export interface IAbilities {
    basic?: IAbility[];
    heroic?: IAbility[];
    trait?: IAbility[];
    mount?: IAbility[];
    hearth?: IAbility[];
    spray?: IAbility[];
    voice?: IAbility[];
}
