import { RunOnWorker, WebWorker } from 'angular-worker-proxy';
import { GameVersion, IGameDescription } from 'heroesprotocol-data';
import linq from 'linq';
import sha1 from 'sha1';
import { IReplayDataProvider } from './IReplayDataProvider';
import { ReplayData } from './ReplayData';


export interface IMatch {
    id: string;
    mapId: string;
    type: GameType;
    gameVersion: string;
    date: string;
    localTimeZone: number;
    duration: number;
}

export enum GameType {
    UNKNOWN = 0,
    FLAG_SOLO_QUEUE = 1,
    FLAG_COOP = 1 << 1,
    FLAG_PVP = 1 << 2,
    FLAG_DRAFT = 1 << 3,
    FLAG_RANKED = 1 << 4,
    MODE_PRACTICE = 1 << 5,
    MODE_AI = 1 << 6,
    MODE_BRAWL = 1 << 7,
    MODE_QM = 1 << 8,
    MODE_UR = 1 << 9,
    MODE_HL = 1 << 10,
    MODE_TL = 1 << 11,
    MODE_CUSTOM = 1 << 12,

    PRACTICE = MODE_PRACTICE | FLAG_SOLO_QUEUE,
    SOLO_AI = MODE_AI | FLAG_SOLO_QUEUE,
    COOP_AI = MODE_AI | FLAG_COOP,
    CUSTOM = MODE_CUSTOM | FLAG_PVP,
    CUSTOM_DRAFT = MODE_CUSTOM | FLAG_PVP | FLAG_DRAFT,
    BRAWL = MODE_BRAWL | FLAG_PVP,
    QUICK_MATCH = MODE_QM | FLAG_PVP,
    UNRANKED_DRAFT = MODE_UR | FLAG_PVP | FLAG_DRAFT,
    HERO_LEAGUE = MODE_HL | FLAG_PVP | FLAG_DRAFT | FLAG_RANKED | FLAG_SOLO_QUEUE,
    TEAM_LEAGUE = MODE_TL | FLAG_PVP | FLAG_DRAFT | FLAG_RANKED
}



@WebWorker('HotsReplay/MatchInfo')
export class MatchInfo {

    constructor(private readonly replay: IReplayDataProvider) {

    }

    private get replayData(): Promise<ReplayData> {
        return this.replay.replayData;
    }

    @RunOnWorker()
    public get matchInfo(): Promise<IMatch> {
        return (async () => {
            const replayData = await this.replayData;
            const header = await replayData.header;
            const details = await replayData.details;
            const initData = await replayData.initData;

            console.log('header', header)
            console.log('details', details)
            console.log('initData', initData)

            let fp = header.m_elapsedGameLoops.toString(16);
            fp += '|' + initData.m_syncLobbyState.m_gameDescription.m_randomValue;
            fp += '|' + initData.m_syncLobbyState.m_gameDescription.m_gameOptions.m_ammId;
            fp += '|' + linq.from(initData.m_syncLobbyState.m_lobbyState.m_slots)
                .toJoinedString('#', elm => elm.m_hero + '~' + elm.m_teamId + '~' + elm.m_toonHandle);

            const match = {} as IMatch;
            match.id = sha1(fp);
            match.gameVersion = new GameVersion(header.m_version).toString();
            match.date = new Date(this.getDate(details.m_timeUTC)).toUTCString();
            match.localTimeZone = this.getTimeZone(details.m_timeLocalOffset);
            match.mapId = details.m_title;
            match.type = this.getGameType(initData.m_syncLobbyState.m_gameDescription);
            match.duration = header.m_elapsedGameLoops / 16;
            return match;
        })();
    }

    private getTimeZone(tz: number) {
        return tz / 10000000 / 60 / 60;
    }

    private getDate(date: number): number {
        return date / 10000 - 11644473600000;
    }

    private getWinningTeam(date: number): number {
        return date / 10000 - 11644473600000;
    }

    private getGameType(gameDesc: IGameDescription): GameType {
        switch (gameDesc.m_gameOptions.m_ammId) {
            case 50021:
            case 50021:
                return GameType.MODE_AI;
            case 50001:
                return GameType.QUICK_MATCH;
            case 50031:
                return GameType.BRAWL;
            case 50051:
                return GameType.UNRANKED_DRAFT;
            case 50061:
                return GameType.HERO_LEAGUE;
            case 50071:
                return GameType.TEAM_LEAGUE;
            default:
                if (!gameDesc.m_gameOptions.m_competitive && !gameDesc.m_gameOptions.m_cooperative) {
                    if (gameDesc.m_gameOptions.m_heroDuplicatesAllowed) {
                        return GameType.CUSTOM;
                    } else {
                        return GameType.CUSTOM_DRAFT;
                    }
                }
                return GameType.UNKNOWN;
        }
    }
}