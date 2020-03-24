import { InjectionToken } from "@angular/core";

export const HERO_ICON_BASE_PATH = new InjectionToken('Base url for hero icons', {
    factory: () => `https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/heroportraits`,
    providedIn: 'root'
});