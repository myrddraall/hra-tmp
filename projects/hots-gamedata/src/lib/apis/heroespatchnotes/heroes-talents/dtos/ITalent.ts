export interface ITalent {
    tooltipId: string;
    talentTreeId: string;
    name: string;
    description: string;
    icon: string;
    type: string;
    sort: number;
    abilityId: string;
    abilityLinks?: string[];
    cooldown?: number;
    isQuest?: boolean;
}
