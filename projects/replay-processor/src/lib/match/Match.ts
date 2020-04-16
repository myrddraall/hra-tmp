import { IMatch } from './IMatch';
import { GameType } from './MatchInfo';
import { Player } from '../player/Player';
import { HotsDB, HeroStringsUtil } from 'hots-gamedata';
import { GameVersion } from 'heroesprotocol-data';
import linq from 'linq';

export class Match {
    private _players: Player[];
    private _h: Player[];

    constructor(private readonly matchData: IMatch, private readonly lang: string = 'enus') {


    }

    public async initialize():Promise<this> {
        if (!this._players) {
            const collection = await (await HotsDB.getVersion(new GameVersion(this.matchData.gameVersion), this.lang)).heroes;
            const heroDataPromises = linq.from(this.matchData.players)
                .select(player => {
                    return player.hero ? collection.getHeroByHeroId(player.hero) : undefined;
                })
                .toArray();
            const playerHeroData = await Promise.all(heroDataPromises);
            const players = [];

            for (let i = 0; i < this.matchData.players.length; i++) {
                const playerData = this.matchData.players[i];
                const player = new Player(playerData, playerHeroData[i]);
                players.push(player);
            }
            this._players = players;
        }
        return this;
    }

    public get id(): string {
        return this.matchData.id;
    }

    public get mapId(): string {
        return this.matchData.mapId;
    }

    public get type(): GameType {
        return this.matchData.type;
    }

    public get gameVersion(): string {
        return this.matchData.gameVersion;
    }

    public get date(): Date {
        return new Date(this.matchData.date);
    }

    public get localTimeZone(): number {
        return this.matchData.localTimeZone;
    }

    public get duration(): number {
        return this.matchData.duration;
    }

    public get winningTeam(): number {
        return this.matchData.winningTeam;
    }

    public get players(): Player[] {
        return this._players;
    }


    //players: import("./player").IPlayer[];

}