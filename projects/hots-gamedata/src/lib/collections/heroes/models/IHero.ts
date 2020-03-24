import { ILife, IWeapon, IEnergy, IRatings, IPortraits, ICharges, AbilityType } from '../../../apis/HeroesToolChest/heroes-data/dtos';
export { ILife, IWeapon, IEnergy, IRatings, IPortraits, ICharges, AbilityType } from '../../../apis/HeroesToolChest/heroes-data/dtos';

export interface IHero {
    id: string;
    linkId: string;
    heroId: string;
    title: string;
    description: string;
    attributeId: string;
    difficulty: string;
    // cHeroId
    // cUnitId/unitId
    //  unitId: string;
    name: string;
    role: string;
    expandedRole: string;
    type: string;
    releaseDate: string;
    //releasePatch: string;
    // tags/descriptors
    tags: string[];
    //portraits: IPortraits;
    units: IUnits;
    ratings: IRatings;
    rarity: string;
    franchise: string;
    gender: string;
    talents: ITalents;

    energytype: string;
    damagetype: string;
    lifetype: string;
    shieldtype: string;
    searchText: string;
}

export interface IHeroListItem {
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

export interface IUnit {


    linkId: string;
    innerRadius: number;
    name: string;
    radius: number;
    sight: number;
    speed: number;
    life: ILife;
    weapons: IWeapon[];
    energy?: IEnergy;
    energytype: string;
    portraits: IPortraits;
    tags: string[];
    abilities: IAbility[];
    /*
    unitId: string;
    innerRadius: number;
    radius: number;
    sight: number;
    speed: number;
    scalingLinkId: string;
    */
}



export interface ITalents {
    [tier: string]: ITalent[];
}

export interface IAbilityBase {
    id: string;
    type: 'ability' | 'talent';
    tooltipId: string;
    button: string;
    name: string;
    icon: string;
    description: string;
    shortDescription: string;
    charges?: ICharges;
    isActive?: boolean;
    toggleCooldown?: number;
    isPassive?: boolean;
    cooldown?: number;
    cooldownDescription?: string;
    energyCostType?: string;
    energyCost?: number;
    energyCostDescription?: string;
    lifeCost?: number;
    lifeCostDescription?: string;
    isQuest?: boolean;
}

export interface IAbility extends IAbilityBase {
    type: 'ability';
}

export interface ITalent extends IAbilityBase {
    type: 'talent';
    sort: number;
    tier: number;
    abilityTalentLinkIds: string[];

    prerequisiteTalentIds?: string[];
}

export interface IUnits {
    [unitId: string]: IUnit;
}

