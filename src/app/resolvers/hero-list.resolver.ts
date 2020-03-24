import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HotsDB, IHeroListItem } from 'hots-gamedata';

@Injectable({
    providedIn: 'root'
})
export class HeroListResolver implements Resolve<IHeroListItem[]> {

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<IHeroListItem[]>{
        const db = await HotsDB.getVersion('latest');
        return await (await db.heroes).getHeroList();
    }
}