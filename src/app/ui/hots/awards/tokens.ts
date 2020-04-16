import { InjectionToken } from "@angular/core";

export const MATCH_AWARD_ICON_BASE_PATH = new InjectionToken('Base url for match award icons', {
    factory: () => `https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/matchawards`,
    providedIn: 'root'
});