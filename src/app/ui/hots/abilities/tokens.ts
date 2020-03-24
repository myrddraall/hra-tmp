import { InjectionToken } from "@angular/core";

export const ABILITY_ICON_BASE_PATH = new InjectionToken('Base url for ability icons', {
    factory: () => `https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/abilitytalents`,
    providedIn: 'root'
});