import { HeroModel2 } from "hots-gamedata/lib"; 
import { IScoreResultRow, Player, IScoreResultSummary } from "replay-processor"; 
import { IMvpScore } from "src/app/ui/hots/data-tables/score-screen-table/IMvpScore";


export class MVPUtil {
    public static getPointsFor(hero: HeroModel2, category: MVPPointCategories): number {
        switch (category) {
            case MVPPointCategories.Assist:
                if (
                    hero.unitId === 'HeroDVaPilot' ||
                    hero.unitId === 'HeroLostVikingsController' ||
                    hero.unitId === 'HeroAbathur'
                ) {
                    return 0.75;
                }
                return MVPPointValues[MVPPointCategories.Assist];
            case MVPPointCategories.TimeSpentDead:
                if (
                    hero.unitId === 'HeroMurky' ||
                    hero.unitId === 'HeroGall'
                ) {
                    return -1.0;
                }
                if (
                    hero.unitId === 'HeroCho'
                ) {
                    return -0.85;
                }
                return MVPPointValues[MVPPointCategories.TimeSpentDead];
            default:
                return MVPPointValues[category];
        }
    }



    public static calculateMvpScore(gameLength: number, scores: IScoreResultRow, player: Player, game: IScoreResultSummary, team1: IScoreResultSummary, team2: IScoreResultSummary): IMvpScore {
        const hero = player.hero;
        const team = player.teamId === 0 ? team1 : team2;
        let scoreCard: Partial<IMvpScore> = {
            Total: 0
        };
        let points;
        if (player.isWinner) {
            points = this.getPointsFor(hero, MVPPointCategories.OnWinningTeam);
            scoreCard[MVPPointCategories[MVPPointCategories.OnWinningTeam]] = points;
            scoreCard.Total += points;
        }

        points = scores.values.SoloKill * this.getPointsFor(hero, MVPPointCategories.Kill);
        scoreCard[MVPPointCategories[MVPPointCategories.Kill]] = points;
        scoreCard.Total += points;

        points = scores.values.Assists * this.getPointsFor(hero, MVPPointCategories.Assist);
        scoreCard[MVPPointCategories[MVPPointCategories.Assist]] = points;
        scoreCard.Total += points;



        if (scores.values.HeroDamage === team.HeroDamage.max) {
            points = this.getPointsFor(hero, MVPPointCategories.TopHeroDamageonTeam);
            scoreCard[MVPPointCategories[MVPPointCategories.TopHeroDamageonTeam]] = points;
            scoreCard.Total += points;
            if (scores.values.HeroDamage === game.HeroDamage.max) {
                points = this.getPointsFor(hero, MVPPointCategories.TopHeroDamage);
                scoreCard[MVPPointCategories[MVPPointCategories.TopHeroDamage]] = points;
                scoreCard.Total += points;
            }
        }

        if (scores.values.SiegeDamage === team.SiegeDamage.max) {
            points = this.getPointsFor(hero, MVPPointCategories.TopSiegeDamageonTeam);
            scoreCard[MVPPointCategories[MVPPointCategories.TopSiegeDamageonTeam]] = points;
            scoreCard.Total += points;
            if (scores.values.SiegeDamage === game.SiegeDamage.max) {
                points = this.getPointsFor(hero, MVPPointCategories.TopSiegeDamage);
                scoreCard[MVPPointCategories[MVPPointCategories.TopSiegeDamage]] = points;
                scoreCard.Total += points;
            }
        }

        if (scores.values.ExperienceContribution === team.ExperienceContribution.max) {
            points = this.getPointsFor(hero, MVPPointCategories.TopXPContributoronTeam);
            scoreCard[MVPPointCategories[MVPPointCategories.TopXPContributoronTeam]] = points;
            scoreCard.Total += points;
            if (scores.values.ExperienceContribution === game.ExperienceContribution.max) {
                points = this.getPointsFor(hero, MVPPointCategories.TopXPContributor);
                scoreCard[MVPPointCategories[MVPPointCategories.TopXPContributor]] = points;
                scoreCard.Total += points;
            }
        }

        if (scores.values.Healing === game.Healing.max) {
            points = this.getPointsFor(hero, MVPPointCategories.TopHealing);
            scoreCard[MVPPointCategories[MVPPointCategories.TopHealing]] = points;
            scoreCard.Total += points;
        }

        if (hero.expandedRoleId === 'Tank' || hero.expandedRoleId === 'Bruiser') {
            if (scores.values.DamageTaken === team.DamageTaken.max) {
                points = this.getPointsFor(hero, MVPPointCategories.TopDamageTakenasWarrioronTeam);
                scoreCard[MVPPointCategories[MVPPointCategories.TopDamageTakenasWarrioronTeam]] = points;
                scoreCard.Total += points;
                if (scores.values.DamageTaken === game.DamageTaken.max) {
                    points = this.getPointsFor(hero, MVPPointCategories.TopDamageTakenasWarrior);
                    scoreCard[MVPPointCategories[MVPPointCategories.TopDamageTakenasWarrior]] = points;
                    scoreCard.Total += points;
                }
            }

        }

        points = thoroughputBonusMultiplier * (scores.values.HeroDamage / game.HeroDamage.max);
        scoreCard.HeroDamageThoroughputBonus = points;
        scoreCard.Total += points;

        points = thoroughputBonusMultiplier * (scores.values.SiegeDamage / game.SiegeDamage.max);
        scoreCard.SiegeDamageThoroughputBonus = points;
        scoreCard.Total += points;

        points = thoroughputBonusMultiplier * (scores.values.ExperienceContribution / game.ExperienceContribution.max);
        scoreCard.ExperienceContributionThoroughputBonus = points;
        scoreCard.Total += points;

        if (hero.expandedRoleId === 'Tank' || hero.expandedRoleId === 'Bruiser') {
            points = thoroughputBonusMultiplier * (scores.values.DamageTaken / game.DamageTaken.max) * thoroughputBonusExtraStatMultiplier;
            scoreCard.DamageTakenThoroughputBonus = points;
            scoreCard.Total += points;
        }

        if (hero.expandedRoleId === 'Support' || hero.expandedRoleId === 'Healer') {
            points = thoroughputBonusMultiplier * (scores.values.Healing / game.Healing.max);
            scoreCard.HealingThoroughputBonus = points;
            scoreCard.Total += points;
        }

        const percentOfGameSpentDead = scores.values.TimeSpentDead / gameLength;
        const percentOfGameSpentAlive = 1 - percentOfGameSpentDead;
        const dtPoints = this.getPointsFor(hero, MVPPointCategories.TimeSpentDead);
        const dttotal = dtPoints * -100;
        const alivePoints = dttotal * percentOfGameSpentAlive;
        points = (percentOfGameSpentDead * 100) * dtPoints;
        scoreCard[MVPPointCategories[MVPPointCategories.TimeSpentDead]] = points;
        scoreCard.TimeSpentAlive = points;
        scoreCard.Score = scoreCard.Total + alivePoints;
        scoreCard.Total += points;

        return scoreCard as IMvpScore;
    }
}


export enum MVPPointCategories {
    Assist,
    Kill,
    TimeSpentDead,
    TopDamageTakenasWarrior,
    TopDamageTakenasWarrioronTeam,
    TopHealing,
    TopHeroDamage,
    TopHeroDamageonTeam,
    TopSiegeDamage,
    TopSiegeDamageonTeam,
    TopXPContributor,
    TopXPContributoronTeam,
    OnWinningTeam
}

export const MVPPointValues = {
    [MVPPointCategories.Kill]: 1.0,
    [MVPPointCategories.Assist]: 1.0,
    [MVPPointCategories.TimeSpentDead]: -0.5,
    [MVPPointCategories.TopHeroDamage]: 1.0,
    [MVPPointCategories.TopHeroDamageonTeam]: 1.0,
    [MVPPointCategories.TopSiegeDamage]: 1.0,
    [MVPPointCategories.TopSiegeDamageonTeam]: 1.0,
    [MVPPointCategories.TopHealing]: 1.0,
    [MVPPointCategories.TopDamageTakenasWarrior]: 1.0,
    [MVPPointCategories.TopDamageTakenasWarrioronTeam]: 0.5,
    [MVPPointCategories.TopXPContributor]: 1.0,
    [MVPPointCategories.TopXPContributoronTeam]: 1.0,
    [MVPPointCategories.OnWinningTeam]: 2.0,
}
export const thoroughputBonusMultiplier = 2.0;
export const thoroughputBonusExtraStatMultiplier = 0.5;




export const statSortValues = {
    Deaths: (value: number, hero: HeroModel2) => {
        return -value;
    },
    DamageTaken: (value: number, hero: HeroModel2) => {
        if (hero.expandedRoleId === 'Tank' || hero.expandedRoleId === 'Bruiser') {
            return value;
        }
        return -value;
    }
}