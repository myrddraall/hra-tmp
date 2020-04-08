import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HeroModel2, HotsDB } from 'hots-gamedata';

@Injectable({
    providedIn: 'root'
})
export class HeroDetailResolver implements Resolve<HeroModel2> {
    private static _prevId: string;
    private static _prev: HeroModel2;
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<HeroModel2> {
        if (route.params.heroId === HeroDetailResolver._prevId) {
            return HeroDetailResolver._prev;
        }
        const db = await HotsDB.getVersion('latest');
        HeroDetailResolver._prev = await (await db.heroes).getHero(route.params.heroId);
        HeroDetailResolver._prevId = route.params.heroId;
        return HeroDetailResolver._prev;
    }
}