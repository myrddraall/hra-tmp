import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HotsDB, IHero } from 'hots-gamedata';

@Injectable({
    providedIn: 'root'
})
export class HeroDetailResolver implements Resolve<IHero> {
    private static _prevId: string;
    private static _prev: IHero;
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IHero> {
        if (route.params.heroId === HeroDetailResolver._prevId) {
            return HeroDetailResolver._prev;
        }
        const db = await HotsDB.getVersion('latest');
        HeroDetailResolver._prev = await (await db.heroes).getHero(route.params.heroId);
        HeroDetailResolver._prevId = route.params.heroId;
        return HeroDetailResolver._prev;
    }
}