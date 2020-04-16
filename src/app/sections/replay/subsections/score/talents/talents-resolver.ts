import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ReplayWorker } from 'replay-processor';
import { IScoreScreenDataItem } from 'src/app/ui/hots/data-tables/score-screen-table/IScoreScreenDataItem';
import linq from 'linq';
import { ITalentDataItem } from 'src/app/ui/hots/data-tables/talent-table/ITalentDataItem';


@Injectable({
    providedIn: 'root'
})
export class TalentsResolver implements Resolve<ITalentDataItem[]> {

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ITalentDataItem[]> {
        console.log('------ start resolve TalentsResolver');
        const replay = route.parent.parent.parent.parent.data.replay as ReplayWorker;

        const results = await replay?.gameStats.talentBuilds;
        if (results) {
            const match = await replay.matchInfo.match;
            const players = linq.from(match.players);
            const playerTalents = linq.from(results);
            const talentsQ = players.select(_ => {
                const talents = playerTalents.where(p => p.player.id === _.id).select(_ => _.talents).firstOrDefault();
                if(talents){
                    for (const talent of talents) {
                        _.hero.selectTalent(talent.id);
                    }
                    return {
                        player: _,
                        teamId: _.teamId,
                        talents: linq.from(talents).select(t => ({
                            time: t.time,
                            talent: _.hero.getTalent(t.id)
                        })).toArray()
                    } as ITalentDataItem;
                }
            }).where(_ => _ !== undefined);
            return talentsQ.toArray();
        }
    }
}