import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HotsDB, IHeroListItem } from 'hots-gamedata';
import { ReplayService } from '../services/replay/replay.service';
import { ReplayWorker } from 'replay-processor';

@Injectable({
    providedIn: 'root'
})
export class ReplayResolver implements Resolve<ReplayWorker> {

    constructor(
        private readonly replayService: ReplayService
    ) {}
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ReplayWorker> {
        try{
            const replay = await this.replayService.getReplay(route.params.replayId);
            const match = await replay.initializeMain();
            console.log('------ end resolve ReplayResolver', match.id);
            return replay;
        }catch(e){
            console.error(e);
            return undefined;
        }
        
        
    }
}