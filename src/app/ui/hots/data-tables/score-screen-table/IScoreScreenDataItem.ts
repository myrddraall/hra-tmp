import { Player, IScoreResultRowStats, IScoreResultSummary } from 'replay-processor';
import { IMvpScore } from './IMvpScore';

export interface IScoreScreenDataItem {
    player: Player,
    mvpScore: IMvpScore;
    award: any;
    values: IScoreResultRowStats;
    sort: IScoreResultRowStats;
    game: IScoreResultSummary,
    team1: IScoreResultSummary,
    team2: IScoreResultSummary,
    gameSort: IScoreResultSummary,
    team1Sort: IScoreResultSummary,
    team2Sort: IScoreResultSummary,
}