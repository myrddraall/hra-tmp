import { IPlayer } from './IPlayer';
import { HeroModel2 } from 'hots-gamedata';
import { SlotType } from 'heroesprotocol-data';
import { IPlayerBattlenetInfo } from './IPlayerBattlenetInfo';
import { IPlayerLoadout } from './IPlayerLoadout';


export class Player {

    public get id(): number {
        return this._playerData.id;
    }


    public get slotId(): number {
        return this._playerData.slotId;
    }


    public get type(): SlotType {
        return this._playerData.type;
    }


    public get userId(): number {
        return this._playerData.userId;
    }


    public get name(): string {
        return this._playerData.name;
    }

    public get teamId(): number {
        return this._playerData.teamId;
    }

    public get battlenetInfo(): IPlayerBattlenetInfo {
        return this._playerData.battlenetInfo;
    }

    public get hasSilencePenalty(): boolean {
        return this._playerData.hasSilencePenalty;
    }

    public get hasVoiceSilencePenalty(): boolean {
        return this._playerData.hasSilencePenalty;
    }

    public get isBlizzardStaff(): boolean {
        return this._playerData.isBlizzardStaff;
    }

    public get hasActiveBoost(): boolean {
        return this._playerData.hasActiveBoost;
    }
    
    public get loadout():IPlayerLoadout {
        return this._playerData.loadout;
    }
    
    public get isWinner():boolean {
        return this._playerData.isWinner;
    }
  
    public get hero():HeroModel2{
        return this._hero;
    }
 
    /*loadout: import("./IPlayerLoadout").IPlayerLoadout;
    isWinner: boolean;
    m_control: number;
    m_observe: number;
    hero: string;*/

    constructor(private readonly _playerData: IPlayer, private readonly _hero?: HeroModel2) {

    }

}