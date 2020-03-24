export interface IAbility {
    uid: string;
    name: string;
    description: string;
    hotkey?: string;
    abilityId: string;
    cooldown: number;
    icon: string;
    type: string;
    trait?: boolean;
    manaCost?: number;
    manaPerSecond?: boolean;
}
