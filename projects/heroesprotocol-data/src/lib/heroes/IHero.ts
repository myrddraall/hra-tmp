import { IHeroTalent } from './IHeroTalent';
import { IHeroAbility } from './IHeroAbility';
export interface IHero {
    name: string;
    short_name: string;
    attribute_id: string;
    translations: string[];
    icon_url: {
        [size: string]: string;
    };
    role: string;
    type: string;
    release_date: string;
    abilities: IHeroAbility[];
    talents: IHeroTalent[];
}
