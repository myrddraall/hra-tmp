import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HeroModel2, HotsDB, IMatchAward } from 'hots-gamedata';
import { IScoreScreenDataItem } from 'src/app/ui/hots/data-tables/score-screen-table/IScoreScreenDataItem';
import { GameVersion } from 'heroesprotocol-data';
import { AwardStatLinks, ReplayWorker } from 'replay-processor';
import linq from 'linq';
import { MVPUtil } from './MvpUtil';

@Injectable({
    providedIn: 'root'
})
export class ScoreScreenResolver implements Resolve<IScoreScreenDataItem[]> {

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IScoreScreenDataItem[]> {
        console.log('------ start resolve ScoreScreenResolver', route);
        const replay = route.parent.parent.parent.parent.data.replay as ReplayWorker;
        console.log(replay['fileOrId']);
        const results = await replay?.gameStats.scoreScreenResults;
        if (results) {
            const match = await replay.matchInfo.match;
            console.log('@@@@@@@@@ match.id', match.id, replay['fileOrId'], (await replay.initialize()).id)
            const players = linq.from(match.players);
            const awardQ = await (await (await HotsDB.getVersion(new GameVersion(match.gameVersion))).matchAwards).awardsQ;
            const stats = linq.from(results.players)
                .select(_ => {
                    const player = players.where(p => p.id === _.playerId).firstOrDefault();
                    return _;
                })
                .select(sr => {
                    const player = players.where(p => p.id === sr.playerId).firstOrDefault();
                    return {
                        ...sr,
                        player,
                        mvpScore: MVPUtil.calculateMvpScore(match.duration, sr, player as any, results.game, results.team1, results.team2),
                        award: awardQ.where(_ => sr.values[_.gameLink] !== 0).select(_ => ({
                            ..._,
                            mvpScreenIcon: _.mvpScreenIcon.replace(/%color%/, player.teamId === 0 ? 'blue' : 'red'),
                            scoreScreenIcon: _.scoreScreenIcon.replace(/%team%/, player.teamId === 0 ? 'blue' : 'red'),
                            value: {
                                player: sr[AwardStatLinks[_.gameLink]],
                                game: results.game[AwardStatLinks[_.gameLink]],
                                team1: results.team1[AwardStatLinks[_.gameLink]],
                                team2: results.team2[AwardStatLinks[_.gameLink]],
                                gameSort: results.gameSort[AwardStatLinks[_.gameLink]],
                                team1Sort: results.team1Sort[AwardStatLinks[_.gameLink]],
                                team2Sort: results.team2Sort[AwardStatLinks[_.gameLink]],
                            }
                        } as IMatchAward)).firstOrDefault(),
                        game: results.game,
                        team1: results.team1,
                        team2: results.team2,
                        gameSort: results.gameSort,
                        team1Sort: results.team1Sort,
                        team2Sort: results.team2Sort,


                    } as IScoreScreenDataItem;

                });
            console.log('------ end resolve ScoreScreenResolver');
            return stats.toArray();
        }
    }
}