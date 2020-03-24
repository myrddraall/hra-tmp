import { InjectionToken } from '@angular/core';

export const TALENT_ICON_BASEURL = new InjectionToken<string>("Base path for Talent Icons", {
    providedIn: 'root', 
    factory: ()=>'https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/abilitytalents/'
});