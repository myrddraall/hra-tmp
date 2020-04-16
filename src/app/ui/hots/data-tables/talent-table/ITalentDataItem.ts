import { Player } from 'replay-processor';
import { TalentDefinitionModel } from 'hots-gamedata';

export interface ITalentDataItem {
    player: Player,
    teamId:number;
    talents: { time: number, talent: TalentDefinitionModel }[];
}