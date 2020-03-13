import { ReplayParser } from './ReplayParser';
import { GameVersion, IGameDescription } from 'heroesprotocol-data';
import sha1 from 'sha1';
import linq from 'linq';



export class MatchParser extends ReplayParser<any> {
    public parse(...args: any[]): Promise<any> {
        throw new Error("Method not implemented.");
    }



    //public async parse(): Promise<IMatch> {
     //   return null;
        /*const header = await this.replay.header;
        const details = await this.replay.details;
        const initData = await this.replay.initData;

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
        */
   // }

    private getTimeZone(tz: number) {
        return tz / 10000000 / 60 / 60;
    }

    private getDate(date: number): number {
        return date / 10000 - 11644473600000;
    }

    private getWinningTeam(date: number): number {
        return date / 10000 - 11644473600000;
    }
/*
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
    */

}