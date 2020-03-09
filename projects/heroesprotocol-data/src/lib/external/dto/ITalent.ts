export interface ITalent {
    tooltipId: string;
    talentTreeId: string;
    name: string;
    description: string;
    icon: string;
    type: string;
    sort: number;
    abilityId: string;
    abilityLinks: string[];
    cooldown?: number;
    isQuest?: boolean;
}
export interface ITalents {
    1: ITalent[];
    4: ITalent[];
    7: ITalent[];
    10: ITalent[];
    13: ITalent[];
    16: ITalent[];
    20: ITalent[];
}
