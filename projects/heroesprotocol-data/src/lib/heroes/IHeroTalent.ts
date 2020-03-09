export interface IHeroTalent {
    name: string;
    title: string;
    description: string;
    icon: string;
    icon_url: {
        [size: string]: string;
    };
    ability: string;
    sort: number;
    cooldown: number;
    mana_cost: number;
    level: number;
}
