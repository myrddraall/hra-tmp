import { RunOnWorker, WebWorker, MainOnly, Cache } from 'angular-worker-proxy';
import { GameVersion, IGameDescription, ISlotInfo, SlotType, ReplayAttributeHelper } from 'heroesprotocol-data';
import linq from 'linq';
import sha1 from 'sha1';
import { IReplayDataProvider } from '../IReplayDataProvider';
import { ReplayData } from '../ReplayData';
import { HotsDB } from 'hots-gamedata';
import { IMatch } from './IMatch';
import { IPlayer } from '../player/IPlayer';
import { Match } from './Match';


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
    private db: HotsDB;
    constructor(private readonly replay: IReplayDataProvider) {

    }

    private get replayData(): Promise<ReplayData> {
        return this.replay.replayData;
    }

    @MainOnly()
    public get match(): Promise<Match> {
        return (async () => {
            return await new Match(await this.matchInfo).initialize();
        })();
    }

    @RunOnWorker()
    @Cache()
    public get matchInfo(): Promise<IMatch> {
        return (async () => {
            const replayData = await this.replayData;
            const header = await replayData.header;
            const details = await replayData.details;
            const initData = await replayData.initData;
            const gameVersion = new GameVersion(header.m_version);
            this.db = await HotsDB.getVersion(gameVersion);

            let fp = header.m_elapsedGameLoops.toString(16);
            fp += '|' + initData.m_syncLobbyState.m_gameDescription.m_randomValue;
            fp += '|' + initData.m_syncLobbyState.m_gameDescription.m_gameOptions.m_ammId;
            fp += '|' + linq.from(initData.m_syncLobbyState.m_lobbyState.m_slots)
                .toJoinedString('#', elm => elm.m_hero + '~' + elm.m_teamId + '~' + elm.m_toonHandle);
            const match = {} as IMatch;
            match.id = sha1(fp);
            match.gameVersion = gameVersion.toString();
            match.date = new Date(this.getDate(details.m_timeUTC)).toUTCString();
            match.localTimeZone = this.getTimeZone(details.m_timeLocalOffset);
            match.mapId = details.m_title;
            match.type = this.getGameType(initData.m_syncLobbyState.m_gameDescription);
            match.duration = header.m_elapsedGameLoops / 16;
            match.players = await this.playerInfo;
            match.region = match.players[0].battlenetInfo.region;
            match.winningTeam = match.players[0].isWinner ? (match.players[0].teamId === 0 ? 0 : 1) : (match.players[0].teamId === 0 ? 1 : 0);
            return match;
        })();
    }

    @RunOnWorker()
    public get playerInfo(): Promise<IPlayer[]> {
        return (async () => {
            const replayData = await this.replayData;
            const details = await replayData.details;
            const initData = await replayData.initData;

            // all slots inc obs, has skin
            const lobbySlots = linq.from(initData.m_syncLobbyState.m_lobbyState.m_slots);
            // console.log('lobbySlots', initData.m_syncLobbyState.m_lobbyState.m_slots);
            // has usernames contains names, joined on index -> m_lobbyState.m_slots.userId
            const userInit = linq.from(initData.m_syncLobbyState.m_userInitialData).select((_, index) => ({ ..._, index }))
            // only actual players of the game, conatains  realm and region info and game result
            const detailPlayerlist = linq.from(details.m_playerList);
            //const heroes = await this.db.heroes;
            const attrib = new ReplayAttributeHelper(await replayData.attributeEvents);

            /*const heroData = await Promise.all(
                detailPlayerlist.select(_ => heroes.normalizeHeroName(_.m_hero).toLowerCase()).select(_ => heroes.getHero(_)).toArray()
            );*/

            /*.select((slot, index) => ({
            index,
            m_announcerPack: slot.m_announcerPack,
            m_banner: slot.m_banner,
            m_control: slot.m_control,
            m_hasSilencePenalty: slot.m_hasSilencePenalty,
            m_hasVoiceSilencePenalty: slot.m_hasVoiceSilencePenalty,
            m_heroHandle: slot.m_hero,
            m_mount: slot.m_mount,
            m_observe: slot.m_observe,
            m_skin: slot.m_skin,
            m_spray: slot.m_spray,
            m_teamId: slot.m_teamId,
            m_toonHandle: slot.m_toonHandle,
            m_userId: slot.m_userId,
            m_voiceLine: slot.m_voiceLine,
            m_workingSetSlotId: slot.m_workingSetSlotId,
            m_heroMasteryTiers: slot.m_heroMasteryTiers,
            m_isBlizzardStaff: slot.m_isBlizzardStaff,
            m_hasActiveBoost: slot.m_hasActiveBoost
        } as Partial<ISlotInfo>))*/
            /* .join(
                 userInit,
                 o => o.m_userId,
                 i => i.index,
                 (slot, user) =>{
                     slot.m_name = user.m_name
                     return slot;
                 }
             )*/
            const q = lobbySlots
                .groupJoin(
                    detailPlayerlist,
                    o => o.m_workingSetSlotId,
                    i => i.m_workingSetSlotId,
                    (lobbySlot, playerDetail) => ({ lobbySlot, playerDetail: playerDetail.firstOrDefault() })
                ).select((data, slotId): IPlayer => {
                    const shortName = data.playerDetail?.m_hero.toLowerCase().replace(/[^a-z0-9]/g, '') || null;
                    let slotType: SlotType;
                    if (data.lobbySlot.m_toonHandle && data.lobbySlot.m_observe == 1) {
                        slotType = SlotType.OBSERVER;
                    } else if (data.lobbySlot.m_toonHandle) {
                        slotType = SlotType.PLAYER;
                    } else if (data.lobbySlot.m_hero) {
                        slotType = SlotType.AI;
                    } else {
                        slotType = SlotType.EMPTY;
                    }

                    let teamId = data.lobbySlot.m_teamId;
                    if (data.lobbySlot.m_workingSetSlotId === 14) {
                        teamId = 0;
                    } else if (data.lobbySlot.m_workingSetSlotId === 15) {
                        teamId = 1;
                    } else if (slotType === SlotType.EMPTY || slotType === SlotType.OBSERVER) {
                        teamId = -1;
                    }
                    // let hero = await heroes.getHero(shortName)
                   
                    return {
                        id: data.lobbySlot.m_workingSetSlotId,
                        type: slotType,
                        slotId: slotId,
                        userId: data.lobbySlot.m_userId,
                        m_control: data.lobbySlot.m_control,
                        name: data.playerDetail?.m_name || null,
                        teamId,
                        m_observe: data.lobbySlot.m_observe,
                        battlenetInfo: {
                            handle: data.lobbySlot.m_toonHandle,
                            id: data.playerDetail?.m_toon.m_id,
                            programId: data.playerDetail?.m_toon.m_programId,
                            realm: data.playerDetail?.m_toon.m_realm,
                            region: data.playerDetail?.m_toon.m_region
                        },
                        hasSilencePenalty: data.lobbySlot.m_hasSilencePenalty,
                        hasVoiceSilencePenalty: data.lobbySlot.m_hasVoiceSilencePenalty,
                        isBlizzardStaff: data.lobbySlot.m_isBlizzardStaff,
                        hasActiveBoost: data.lobbySlot.m_hasActiveBoost,
                        heroId: data.lobbySlot.m_hero.toLowerCase(),
                        heroName: data.playerDetail?.m_hero,
                        loadout: {
                            announcerPack: data.lobbySlot.m_announcerPack,
                            banner: data.lobbySlot.m_banner,
                            mount: data.lobbySlot.m_mount,
                            skin: data.lobbySlot.m_skin,
                            spray: data.lobbySlot.m_spray,
                            voiceLine: data.lobbySlot.m_voiceLine
                        },
                        isWinner: data.playerDetail?.m_result === 1,
                        hero: data.lobbySlot?.m_hero || undefined//heroData[slotId],

                    }
                    /*return {
                        slotId,
                        ...data.lobbySlot,
                        m_name: data.playerDetail?.m_name,
                        m_programId: data.playerDetail?.m_toon.m_programId,
                        m_realm: data.playerDetail?.m_name,
                        m_region: data.playerDetail?.m_toon.m_region,
                        m_result: data.playerDetail?.m_result,
                        m_hero: data.playerDetail?.m_hero,
                    }*/
                })
            return q.toArray();
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