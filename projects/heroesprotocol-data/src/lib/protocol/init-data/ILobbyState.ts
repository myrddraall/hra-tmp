import { ILobbyStateSlot } from "./ILobbyStateSlot";
export interface ILobbyState {
    m_defaultAIBuild: number;
    m_defaultDifficulty: number;
    m_gameDuration: number;
    m_hostUserId: number;
    m_isSinglePlayer: boolean;
    m_maxObservers: number;
    m_phase: number;
    m_pickedMapTag: number;
    m_randomSeed: number;
    m_slots: ILobbyStateSlot[];
}
