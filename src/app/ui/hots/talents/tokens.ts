import { InjectionToken } from "@angular/core";

export const TALENT_ICON_BASE_PATH = new InjectionToken('Base url for talent icons', {
    factory: () => `https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/abilitytalents`,
    providedIn: 'root'
});