import { IWeapon } from './IWeapon';
import { ILife } from './ILife';
import { IRatings } from './IRatings';
import { IAbilities } from './IAbilities';
import { IPortraits } from './IPortraits';
import { ISubAbilities } from './ISubAbilities';

import { IEnergy } from './IEnergy';
export interface IUnit {
    unitId: string;
    hyperlinkId: string;
    innerRadius: number;
    radius: number;
    sight: number;
    speed: number;
    scalingLinkId: string;
    descriptors: string[];
    portraits: IPortraits;
    life: ILife;
    weapons: IWeapon[];
    abilities: IAbilities;
    subAbilities: ISubAbilities[];
    energy?: IEnergy;
}
