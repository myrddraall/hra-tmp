export interface ILobbyStateSlot {
    m_aiBuild: number;
    m_announcerPack: string;
    m_artifacts: string[];
    m_banner: string;
    m_colorPref: number;
    m_control: number;
    m_difficulty: number;
    m_handicap: number;
    m_hasSilencePenalty: boolean;
    m_hasVoiceSilencePenalty: boolean;
    m_hero: string;
    m_heroMasteryTiers: Array<{
        m_hero: string;
        m_tier: number;
    }>;
    m_logoIndex: number;
    m_mount: string;
    m_observe: number;
    m_racePref: {
        m_race: null;
    };
    m_rewards: number[];
    m_skin: string;
    m_spray: string;
    m_tandemLeaderUserId: null;
    m_teamId: number;
    m_toonHandle: string;
    m_userId: number;
    m_voiceLine: string;
    m_workingSetSlotId: number;
}
