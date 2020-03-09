export enum HeroRole{
    Warrior = 'Warrior',
    Specialist = 'Specialist',
    Support = 'Support',
    Assasin = 'Assasin'
}

export enum HeroRoleExtended{
    Tank = 'Tank',
    Bruiser = 'Bruiser',
    Support = 'Support',
    Healer = 'Healer',
    RangedAssasin = 'Ranged Assassin',
    MeleeAssassin = 'Melee Assassin'
}

export enum HeroType{
    Ranged = 'Ranged',
    Melee = 'Melee'
}
export class Hero{
    

    public id:number;
    public name:string;
    public shortName: string;
    public attributeId: string;
    public heroId: string;
    public unitId: string;
    icon: string;
    role: HeroRole;
    expandedRole: HeroRoleExtended;
    type: HeroType;
    releaseDate: string;
    releasePatch: string;
    tags: string[];
    
}