import { RunOnWorker, WebWorker } from 'angular-worker-proxy';
import { getSStatValue, IKeyValueArray, IScoreResult, ISScoreResultEvent, isSScoreResultEvent, isSStatGameEvent, ISStatGameEvent, SlotType } from 'heroesprotocol-data';
import { HotsDB } from 'hots-gamedata';
import linq from 'linq';
import { IReplayDataProvider } from '../IReplayDataProvider';
import { MatchInfo } from '../match/MatchInfo';
import { ReplayData } from '../ReplayData';
import { IPlayer } from '../player/IPlayer';


export const AwardStatLinks = {
    "EndOfMatchAwardMVPBoolean": true,

    "EndOfMatchAwardClutchHealerBoolean": "ClutchHealsPerformed",
    "ClutchHealsPerformed": "EndOfMatchAwardClutchHealerBoolean",

    "EndOfMatchAwardHatTrickBoolean": true,

    "EndOfMatchAwardHighestKillStreakBoolean": "HighestKillStreak",
    "HighestKillStreak": "EndOfMatchAwardHighestKillStreakBoolean",

    "EndOfMatchAwardMostTeamfightHeroDamageDoneBoolean": "TeamfightHeroDamage",
    "TeamfightHeroDamage": "EndOfMatchAwardMostTeamfightHeroDamageDoneBoolean",

    "EndOfMatchAwardMostTeamfightHealingDoneBoolean": "TeamfightHealing",
    "TeamfightHealing": "EndOfMatchAwardMostTeamfightHealingDoneBoolean",

    "EndOfMatchAwardMostVengeancesPerformedBoolean": "VengeancesPerformed",
    "VengeancesPerformed": "EndOfMatchAwardMostVengeancesPerformedBoolean",

    "EndOfMatchAwardMostDaredevilEscapesBoolean": "DaredevilEscapes",
    "DaredevilEscapes": "EndOfMatchAwardMostDaredevilEscapesBoolean",

    "EndOfMatchAwardMostEscapesBoolean": "Escapes",
    "Escapes": "EndOfMatchAwardMostEscapesBoolean",

    "EndOfMatchAwardMostXPContributionBoolean": "ExperienceContribution",
    "ExperienceContribution": "EndOfMatchAwardMostXPContributionBoolean",

    "EndOfMatchAwardMostHeroDamageDoneBoolean": "HeroDamage",
    "HeroDamage": "EndOfMatchAwardMostHeroDamageDoneBoolean",

    "EndOfMatchAwardMostKillsBoolean": "SoloKill",
    "SoloKill": "EndOfMatchAwardMostKillsBoolean",





    "EndOfMatchAwardMostProtectionBoolean": "ProtectionGivenToAllies",
    "ProtectionGivenToAllies": "EndOfMatchAwardMostProtectionBoolean",

    "EndOfMatchAward0DeathsBoolean": true,

    "EndOfMatchAwardMostSiegeDamageDoneBoolean": "SiegeDamage",
    "SiegeDamage": "EndOfMatchAwardMostSiegeDamageDoneBoolean",


    "EndOfMatchAwardMostDamageTakenBoolean": "DamageTaken",
    "DamageTaken": "EndOfMatchAwardMostDamageTakenBoolean",

    "EndOfMatchAward0OutnumberedDeathsBoolean": true,

    "EndOfMatchAwardMostHealingBoolean": "Healing",
    "Healing": "EndOfMatchAwardMostHealingBoolean",

    "EndOfMatchAwardMostStunsBoolean": "TimeStunningEnemyHeroes",
    "TimeStunningEnemyHeroes": "EndOfMatchAwardMostStunsBoolean",

    "EndOfMatchAwardMostRootsBoolean": "TimeRootingEnemyHeroes",
    "TimeRootingEnemyHeroes": "EndOfMatchAwardMostRootsBoolean",

    "EndOfMatchAwardMostSilencesBoolean": "TimeSilencingEnemyHeroes",
    "TimeSilencingEnemyHeroes": "EndOfMatchAwardMostSilencesBoolean",

    "EndOfMatchAwardMostMercCampsCapturedBoolean": "MercCampCaptures",
    "MercCampCaptures": "EndOfMatchAwardMostMercCampsCapturedBoolean",

    "EndOfMatchAwardMapSpecificBoolean": true,

    "EndOfMatchAwardMostDragonShrinesCapturedBoolean": "DragonShrinesCaptured",
    "DragonShrinesCaptured": "EndOfMatchAwardMostDragonShrinesCapturedBoolean",

    "EndOfMatchAwardMostCoinsPaidBoolean": "BlackheartDoubloonsTurnedIn",
    "BlackheartDoubloonsTurnedIn": "EndOfMatchAwardMostCoinsPaidBoolean",

    "EndOfMatchAwardMostCurseDamageDoneBoolean": "CurseDamageDone",
    "CurseDamageDone": "EndOfMatchAwardMostCurseDamageDoneBoolean",

    "EndOfMatchAwardMostImmortalDamageBoolean": true,
    "EndOfMatchAwardMostDamageDoneToZergBoolean": true,
    "EndOfMatchAwardMostDamageToPlantsBoolean": true,

    "EndOfMatchAwardMostDamageToMinionsBoolean": "DamageDoneToShrineMinions",
    "DamageDoneToShrineMinions": "EndOfMatchAwardMostDamageToMinionsBoolean",

    "EndOfMatchAwardMostTimeInTempleBoolean": true,



    "EndOfMatchAwardMostGemsTurnedInBoolean": true,
    "EndOfMatchAwardMostSkullsCollectedBoolean": true,
    "EndOfMatchAwardMostAltarDamageDone": true,
    "EndOfMatchAwardMostNukeDamageDoneBoolean": true,

    "EndOfMatchAwardMostTeamfightDamageTakenBoolean": "TeamfightDamageTaken",
    "TeamfightDamageTaken": "EndOfMatchAwardMostTeamfightDamageTakenBoolean",


    "EndOfMatchAwardGivenToNonwinner": true,
    "EndOfMatchAwardMostTimePushingBoolean": true,

    "EndOfMatchAwardMostTimeOnPointBoolean": "TimeOnPoint",
    "TimeOnPoint": "EndOfMatchAwardMostTimeOnPointBoolean",

    "EndOfMatchAwardMostInterruptedCageUnlocksBoolean": "CageUnlocksInterrupted",
    "CageUnlocksInterrupted": "EndOfMatchAwardMostInterruptedCageUnlocksBoolean",

    "EndOfMatchAwardMostSeedsCollectedBoolean": "GardenSeedsCollectedByPlayer",
    "GardenSeedsCollectedByPlayer": "EndOfMatchAwardMostSeedsCollectedBoolean",

    /*
        "Takedowns",
    "Deaths",
    "TownKills",
    "SoloKill",
    "Assists",
    "MetaExperience",
    "Level",
    "TeamTakedowns",
    "ExperienceContribution",
    "Healing",
    "SiegeDamage",
    "StructureDamage",
    "MinionDamage",
    "HeroDamage",
    "MercCampCaptures",
    "WatchTowerCaptures",
    "SelfHealing",
    "TimeSpentDead",
    "TimeCCdEnemyHeroes",
    "CreepDamage",
    "SummonDamage",
    "Tier1Talent",
    "Tier2Talent",
    "Tier3Talent",
    "Tier4Talent",
    "Tier5Talent",
    "Tier6Talent",
    "Tier7Talent",
    "DamageTaken",
    "DamageSoaked",
    "Role",
    "KilledTreasureGoblin",
    "GameScore",
    "HighestKillStreak",
    "TeamLevel",
    "ProtectionGivenToAllies",
    "TimeSilencingEnemyHeroes",
    "TimeRootingEnemyHeroes",
    "TimeStunningEnemyHeroes",
    "ClutchHealsPerformed",
    "EscapesPerformed",
    "VengeancesPerformed",
    "TeamfightEscapesPerformed",
    "OutnumberedDeaths",
    "TeamfightHealingDone",
    "TeamfightDamageTaken",
    "TeamfightHeroDamage",
    
    "OnFireTimeOnFire",
    "LunarNewYearSuccesfulArtifactTurnIns",
    
    
    
    "TeamWinsDiablo",
    "TeamWinsFemale",
    "TeamWinsMale",
    "TeamWinsStarCraft",
    "TeamWinsWarcraft",
    "WinsWarrior",
    "WinsAssassin",
    "WinsSupport",
    "WinsSpecialist",
    "WinsStarCraft",
    "WinsDiablo",
    "WinsWarcraft",
    "WinsMale",
    "WinsFemale",
    "PlaysStarCraft",
    "PlaysDiablo",
    "PlaysOverwatch",
    "PlaysWarCraft",
    "PlaysWarrior",
    "PlaysAssassin",
    "PlaysSupport",
    "PlaysSpecialist",
    "PlaysMale",
    "PlaysFemale",
    "LunarNewYearEventCompleted",
    "StarcraftDailyEventCompleted",
    "StarcraftPiecesCollected",
    "LunarNewYearRoosterEventCompleted",
    "TouchByBlightPlague",
    "PachimariMania",
    "LessThan4Deaths",
    "LessThan3TownStructuresLost",
    "PhysicalDamage",
    "SpellDamage",
    "Multikill",
    "MinionKills",
    "RegenGlobes",
    
    */
}


const StatSortValueConverters: { [key: string]: (value: number, role: string) => number } = {
    Deaths: (value: number, role: string) => {
        if (value !== undefined)
            return -1 * value;
    },
    TimeSpentDead: (value: number, role: string) => {
        if (value !== undefined)
            return -1 * value;
    },
    DamageTaken: (value: number, role: string) => {
        if (value !== undefined) {
            if (role === 'Tank' || role === 'Bruiser') {
                return value;
            }
            return -1 * value;
        }
    },
    TeamfightDamageTaken: (value: number, role: string) => {
        if (value !== undefined) {
            if (role === 'Tank' || role === 'Bruiser') {
                return value;
            }
            return -1 * value;
        }
    }
}

@WebWorker('HotsReplay/GameStats')
export class GameStats {
    private _db: HotsDB;
    constructor(private readonly replay: IReplayDataProvider, private readonly match: MatchInfo) {

    }

    private get replayData(): Promise<ReplayData> {
        return this.replay.replayData;
    }

    @RunOnWorker()
    public get scoreResults(): Promise<IScoreResults> {
        return this.getScoreResults();
    }

    @RunOnWorker()
    public get scoreScreenResults(): Promise<IScoreResults> {
        return this.getScoreStats([
            "Takedowns",
            "Deaths",
            "SoloKill",
            "Assists",
            "ExperienceContribution",
            "Healing",
            "SelfHealing",
            "SiegeDamage",
            "HeroDamage",
            "DamageTaken",
            "TeamLevel",
            "TimeSpentDead",
            "OnFireTimeOnFire"
        ], true);
    }

    public get db() {
        return (async () => {
            if (!this._db) {
                this._db = await HotsDB.getVersion((await this.replayData).version)
            }
            return this._db;
        })();
    }

    protected async getScoreStats(stats: string[], includeAwardStats?: boolean): Promise<IScoreResults> {
        //this.db = HotsDB.getVersion(this.replayData.)
        return this.getScoreResults(_ =>
            stats.indexOf(_.m_name) !== -1 ||
            (
                includeAwardStats &&
                !!AwardStatLinks[_.m_name]
            )
        );
    }

    protected async getScoreResults(predicate?: (stat: IKeyValueArray<IScoreResult>) => boolean): Promise<IScoreResults> {
        const players = linq.from(await this.match.playerInfo);
        const replayData = await this.replayData;

        const heroCollection = await (await this.db).heroes;
        await heroCollection.initialize();
        const gamestrings = heroCollection.gameStrings;


        const results = linq.from(await replayData.trackerEvents)
            .where(e => isSScoreResultEvent(e))
            .last() as ISScoreResultEvent;

        let statsQ = linq.from(results.m_instanceList);
        if (predicate) {
            statsQ = statsQ.where(predicate);
        }
        const flatStatsQ = statsQ
            .selectMany(s => {
                return linq.from(s.m_values)
                    .select((v, slotId) => {
                        const player = players.where(_ => _.slotId === slotId).firstOrDefault();
                        return ({
                            player: player.type !== SlotType.AI && player.type !== SlotType.PLAYER ? -1 : player.id,
                            role: gamestrings.unit.expandedrole[player.hero],
                            teamId: player.teamId,
                            name: s.m_name,
                            value: v[0]?.m_value
                        });
                    });
            });


        const grp = (k: string, v: linq.IEnumerable<number>) => {
            const s = v.where(_ => _ !== undefined);
            return {
                k,
                v: {
                    sum: s.sum(_ => _),
                    min: s.min(_ => _),
                    max: s.max(_ => _),
                    avg: s.average(_ => _)
                }
            }
        };

        const gameTotals = flatStatsQ
            .groupBy(_ => _.name, _ => _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;

        const gameTotalsSort = flatStatsQ
            .groupBy(_ => _.name, _ => StatSortValueConverters[_.name] ? StatSortValueConverters[_.name](_.value, _.role) : _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;


        const team1Totals = flatStatsQ
            .where(_ => _.teamId === 0)
            .groupBy(_ => _.name, _ => _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;
        const team1TotalsSort = flatStatsQ
            .where(_ => _.teamId === 0)
            .groupBy(_ => _.name, _ => StatSortValueConverters[_.name] ? StatSortValueConverters[_.name](_.value, _.role) : _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;

        const team2Totals = flatStatsQ
            .where(_ => _.teamId === 1)
            .groupBy(_ => _.name, _ => _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;
        const team2TotalsSort = flatStatsQ
            .where(_ => _.teamId === 1)
            .groupBy(_ => _.name, _ => StatSortValueConverters[_.name] ? StatSortValueConverters[_.name](_.value, _.role) : _.value, grp)
            .toObject(_ => _.k, _ => _.v) as IScoreResultSummary;

        // totals.playerId = -1;
        // totals.playerId = -1;
        const stats = flatStatsQ
            .groupBy(_ => _.player, _ => _, (key, value) => {
                const row: IScoreResultRow = {
                    playerId: key,
                    teamId: value.first().teamId,
                    values: value.toObject(_ => _.name, _ => _.value) as IScoreResultRowStats,
                    sort: value.toObject(
                        _ => _.name,
                        _ => StatSortValueConverters[_.name] ? StatSortValueConverters[_.name](_.value, value.first().role) : _.value
                    ) as IScoreResultRowStats
                }
                return row;
            })
            .where(_ => _.playerId !== -1)
            .orderBy(_ => _.teamId)
            .toArray();


        return {
            game: gameTotals,
            team1: team1Totals,
            team2: team2Totals,
            gameSort: gameTotalsSort,
            team1Sort: team1TotalsSort,
            team2Sort: team2TotalsSort,
            players: stats
        };
    }

    @RunOnWorker()
    public get talentBuilds(): Promise<IPlayerTalentBuild[]> {
         return this.getTalentBuilds();
    }

    private async getTalentBuilds(): Promise<IPlayerTalentBuild[]> {
        const players = linq.from(await this.match.playerInfo);
        const replayData = await this.replayData;
        const tickRate = 16;
        const results = linq.from(await replayData.trackerEvents)
            .where(_ => isSStatGameEvent(_) && _.m_eventName === 'TalentChosen')
            .groupBy((_: ISStatGameEvent) => getSStatValue(_.m_intData, 'PlayerID') - 1, _ => _, (key, event) => ({
                index: key,
                player: players.where(_ => _.id === key).firstOrDefault(),
                talents: event.select((_: ISStatGameEvent): any => { //ITalentPick
                   // const player = players.where(_ => _.id === key).firstOrDefault();
                    const talentName = getSStatValue(_.m_stringData, 'PurchaseName');
                    return {
                        id: talentName,
                        time: _._gameloop / 16
                    };
                    /*const hero = heroData.firstOrDefault(_ => _.name === player.hero);
                    if (!hero || !hero.talents || !hero.talents.length) {
                        return <any>{
                            name: talentName,
                            time: _._gameloop / tickRate
                        }
                    } else { }
                    const talentQ = linq.from(hero.talents);
                    return Object.assign({}, talentQ.firstOrDefault(_ => _.name.toUpperCase() === talentName.toUpperCase()), { name: talentName, time: _._gameloop / tickRate });
               */
                }).toArray()
            })).select(_ => ({
                player: _.player,
                talents: _.talents
            } as IPlayerTalentBuild));
        return results.toArray();
    }

}


export interface IPlayerTalentBuild{
    player: IPlayer;
    talents: {id:string, time:number }[];
}
export interface IScoreResults {
    game: IScoreResultSummary;
    team1: IScoreResultSummary;
    team2: IScoreResultSummary;
    gameSort: IScoreResultSummary;
    team1Sort: IScoreResultSummary;
    team2Sort: IScoreResultSummary;
    players: IScoreResultRow[];
}

export interface IScoreResultSummary {
    [stat: string]: {
        total: number;
        min: number;
        max: number;
        avg: number;
    };
}

export interface IScoreResultRow {
    playerId: number;
    teamId: number;
    values: IScoreResultRowStats;
    sort: IScoreResultRowStats;

}
export interface IScoreResultRowStats {
    [stat: string]: number;
}