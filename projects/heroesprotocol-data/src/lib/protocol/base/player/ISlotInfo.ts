export interface ISlotInfo {
    index: number;
    // from initData.m_syncLobbyState.m_lobbyState.m_slots
    m_announcerPack: string;
    m_banner: string;
    m_control: number; // 0?? 2: player
    m_hasSilencePenalty: boolean;
    m_hasVoiceSilencePenalty: boolean;
    m_heroHandle: string;
    m_mount: string;
    m_observe: number;
    m_skin: string;
    m_spray: string;
    m_teamId: number;
    m_toonHandle: string;
    m_userId: number;
    m_voiceLine: string;
    m_workingSetSlotId: number;
    // from initData.m_syncLobbyState.m_userInitialData
    m_name: string;
    // details.m_playerList
    m_toon_id: number;
    m_programId: string;
    m_realm: number;
    m_region: number;
    m_result: number;
    m_hero: string;
    m_heroMasteryTiers: Array<{
        m_hero: string;
        m_tier: number;
    }>;
    m_isBlizzardStaff:boolean;
    m_hasActiveBoost:boolean;
}
