import { SlotType } from 'heroesprotocol-data';
import { IPlayerBattlenetInfo } from "./IPlayerBattlenetInfo";
import { IPlayerLoadout } from "./IPlayerLoadout";
export interface IPlayer {
    id: number;
    slotId: number;
    type: SlotType
    userId: number;
    name: string;
    teamId: number;
    battlenetInfo: IPlayerBattlenetInfo;
    hasSilencePenalty: boolean;
    hasVoiceSilencePenalty: boolean;
    isBlizzardStaff: boolean;
    hasActiveBoost: boolean;
    heroId: string;
    heroName: string;
    loadout: IPlayerLoadout;
    isWinner: boolean;
    // TODO: verify use
    m_control: number;
    m_observe: number;
    hero: string;
}
