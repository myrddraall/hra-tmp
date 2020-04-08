import { AbilityTalentDefinitionModelBase } from './AbilityTalentDefinitionModelBase';
import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { IAbilityData, ITalentData } from './IAbilityData';
import { TalentTeir } from './TalentTeir';

export class TalentDefinitionModel extends AbilityTalentDefinitionModelBase<ITalentData>{
    constructor(
        data: ITalentData,
        gamestrings: IGameStrings,
        gamestringsLocalized: IGameStrings,
        protected readonly abilityList?: IAbilityData[],
        protected readonly talentList?: ITalentData[]
    ) {
        super(data, gamestrings, gamestringsLocalized);
    }

    public get sort(): number {
        return this.data.sort ? this.data.sort - 1 : 0;
    }

    public get abilityTalentLinkIds(): string[] {
        return this.data.abilityTalentLinkIds;
    }

    public get isQuest(): boolean {
        return this.data.isQuest;
    }

    public get prerequisiteTalentIds(): string[] {
        return this.data.prerequisiteTalentIds;
    }

    public get isActive(): boolean {
        return this.data.isActive === true;
    }

    public get tier(): TalentTeir {
        return this.data.tier as TalentTeir;
    }
}