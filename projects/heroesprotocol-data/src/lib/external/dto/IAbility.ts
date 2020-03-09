export interface IAbility {
    name: string;
    description: string;
    hotkey: string;
    abilityId: string;
    cooldown: number;
    icon: string;
    type: string;
    trait?: boolean;
    uid?: string;
    manaCost?: number;
}
export interface IAbilities {
    [heroName: string]: IAbilities[];
    [form: number]: IAbilities[];
}
