import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { AbilityDefinitionModel } from './AbilityDefinitionModel';
import { TalentDefinitionModel } from './TalentDefinitionModel';
import { IHeroRecord } from '../IHeroRecord';
import { IAbilityData, ITalentData } from './IAbilityData';
import linq from 'linq';
import { TalentTeir } from './TalentTeir';


export class UnitDefinitionModel<TData extends DTOs.IUnit | DTOs.IHero = DTOs.IUnit> {
    private _abilities: AbilityDefinitionModel[] = [];
    private _talents: TalentDefinitionModel[] = [];
    private _heroId:string;
    public constructor(protected readonly data: TData, protected readonly gamestrings: IGameStrings, protected readonly gamestringsLocalized: IGameStrings, heroData?: IHeroRecord) {
        let abilities: IAbilityData[] = [];
        let talents: ITalentData[] = [];

        if (heroData) {
            this._heroId = heroData.heroId;

            if (data.abilities) {
                for (const type in data.abilities) {
                    if (data.abilities.hasOwnProperty(type)) {
                        const abilityList = data.abilities[type];
                        for (const ability of abilityList) {
                            abilities.push({ ...ability, type });
                        }
                    }
                }
            }
            if (data.subAbilities) {
                for (const subAbilities of data.subAbilities) {
                    for (const key in subAbilities) {
                        if (subAbilities.hasOwnProperty(key)) {
                            const abs = subAbilities[key];
                           // const keyParts = key.split('|');
                            //const subOf = keyParts[1];

                            for (const type in abs) {
                                if (abs.hasOwnProperty(type)) {
                                    const abilityList = abs[type] as DTOs.IAbility[];
                                    for (const ability of abilityList) {
                                        //const subabilityOf = subOf !== ability.nameId ? subOf : undefined;
                                        //console.log(ability.nameId, subabilityOf);
                                        abilities.push({ ...ability, subabilityOf: key, type });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (heroData?.talents) {
                for (const tierStr in heroData.talents) {
                    if (heroData.talents.hasOwnProperty(tierStr)) {
                        const tier = +tierStr.substr(5);
                        const tierList = heroData.talents[tierStr] as DTOs.ITalent[];
                        for (const talent of tierList) {
                            talents.push({ ...talent, tier });
                            if (talent.abilityType === 'Active' && talent.isActive === true) {
                                const abil: IAbilityData = {
                                    abilityType: DTOs.AbilityType.Active,
                                    buttonId: talent.buttonId,
                                    icon: talent.icon,
                                    nameId: talent.nameId,
                                    charges: talent.charges,
                                    isActive: talent.isActive === true ? true : false,
                                    isPassive: talent.isPassive,
                                    toggleCooldown: talent.toggleCooldown,
                                    subabilityOf: talent.abilityTalentLinkIds ? talent.abilityTalentLinkIds[0] : undefined,
                                    type: 'activable',
                                };
                                abilities.push(abil);
                                //this._abilities.push(new AbilityDefinitionModel(abil, this.gamestrings, this.gamestringsLocalized, abilities, talents))
                            }
                        }
                    }
                }
            }


            for (const ability of abilities) {
                this._abilities.push(new AbilityDefinitionModel(ability, this.gamestrings, this.gamestringsLocalized, abilities, talents));
            }

        }
        if(!heroData){
            this._heroId = (data as unknown as IHeroRecord)?.heroId;
            if ((data as DTOs.IHero)?.talents) {
                const tals = (data as DTOs.IHero).talents;
                for (const tierStr in tals) {
                    if (tals.hasOwnProperty(tierStr)) {
                        const tier = +tierStr.substr(5);
                        const tierList = tals[tierStr] as DTOs.ITalent[];
                        for (const talent of tierList) {
                            talents.push({ ...talent, tier });
                        }
                    }
                }
    
            }
    
            for (const talent of talents) {
                this._talents.push(new TalentDefinitionModel(talent, gamestrings, gamestringsLocalized, abilities, talents));
            }
        }
    }

    public get talents(): TalentDefinitionModel[] {
        return this._talents;
    }

    public getTalents(tier:TalentTeir): TalentDefinitionModel[] {
        return this.talentQuery.where(_ => _.tier === tier).toArray();
    }

    public get unitId(): string {
        return this.data.unitId;
    }

    public get heroId(): string {
        return this._heroId;
    }

    public get tags(): string[] {
        return this.data.descriptors;
    }

    public get energy(): DTOs.IEnergy {
        return this.data.energy;
    }
    public get linkId(): string {
        return this.data.hyperlinkId;
    }

    public get innerRadius(): number {
        return this.data.innerRadius;
    }

    public get life(): DTOs.ILife {
        return this.data.life;
    }

    public get portraits(): DTOs.IPortraits {
        return this.data.portraits;
    }

    public get radius(): number {
        return this.data.radius;
    }

    public get sight(): number {
        return this.data.sight;
    }

    public get speed(): number {
        return this.data.speed;
    }

    public get weapons(): DTOs.IWeapon[] {
        return this.data.weapons;
    }

    public get damageTypeId(): string {
        return this.gamestrings.unit.damagetype[this.heroId];
    }
    public get damageType(): string {
        return this.gamestringsLocalized.unit.damagetype[this.heroId];
    }

    public get description(): string {
        return this.gamestringsLocalized.unit.description[this.heroId];
    }
    public get difficultyId(): string {
        return this.gamestrings.unit.difficulty[this.heroId];
    }
    public get difficulty(): string {
        return this.gamestringsLocalized.unit.difficulty[this.heroId];
    }
    public get energyTypeId(): string {
        return this.gamestrings.unit.energytype[this.heroId];
    }
    public get energyType(): string {
        return this.gamestringsLocalized.unit.energytype[this.heroId];
    }
    public get expandedRoleId(): string {
        return this.gamestrings.unit.expandedrole[this.heroId];
    }
    public get expandedRole(): string {
        return this.gamestringsLocalized.unit.expandedrole[this.heroId];
    }

    public get lifeTypeId(): string {
        return this.gamestrings.unit.lifetype[this.heroId];
    }

    public get lifeType(): string {
        return this.gamestringsLocalized.unit.lifetype[this.heroId];
    }

    public get name(): string {
        return this.gamestringsLocalized.unit.name[this.heroId];
    }

    public get roleId(): string {
        return this.gamestrings.unit.role[this.heroId];
    }
    public get role(): string {
        return this.gamestringsLocalized.unit.role[this.heroId];
    }

    public get searchText(): string {
        return this.gamestringsLocalized.unit.searchtext[this.heroId];
    }

    public get shieldTypeId(): string {
        return this.gamestrings.unit.shieldtype[this.heroId];
    }

    public get shieldType(): string {
        return this.gamestringsLocalized.unit.shieldtype[this.heroId];
    }

    public get title(): string {
        return this.gamestringsLocalized.unit.title[this.heroId];
    }

    public get typeId(): string {
        return this.gamestrings.unit.type[this.heroId];
    }

    public get type(): string {
        return this.gamestringsLocalized.unit.type[this.heroId];
    }


    public get abilities(): AbilityDefinitionModel[] {
        return this._abilities;
    }

    protected get abilitiesQuery() {
        return linq.from(this._abilities);
    }

    public getAbility(id:string): AbilityDefinitionModel
    {
        return this.abilitiesQuery.where(_ => _.id === id).firstOrDefault();
    }

    public get abilitiesQ(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.hotkey === 'Q').toArray();
    }

    public get abilitiesW(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.hotkey === 'W').toArray();
    }
    public get abilitiesE(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.hotkey === 'E').toArray();
    }

    public get abilitiesZ(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.abilityType === 'mount').toArray();
    }

    public get abilitiesB(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.abilityType === 'hearth').toArray();
    }

    public get abilitiesR(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.abilityType === 'heroic').toArray();
    }

    public get abilitiesD(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.abilityType === 'trait').toArray();
    }

    public get abilitiesActivatable(): AbilityDefinitionModel[] {
        return linq.from(this.abilities).where(_ => _.abilityType === 'activable').toArray();
    }

    protected get talentQuery() {
        return linq.from(this.talents)
    }

    protected getTalent(id: string): TalentDefinitionModel;
    protected getTalent(tier: TalentTeir, index: number): TalentDefinitionModel;
    protected getTalent(idOrTier: string | TalentTeir, index?: number): TalentDefinitionModel {
        if (typeof idOrTier === 'string') {
            return this.talentQuery.where(_ => _.id === idOrTier).firstOrDefault();
        }
        return this.talentQuery.where(_ => _.tier === idOrTier && _.sort === index).firstOrDefault();
    }

    protected talentIdToIndex(talentId: string): number {
        return this.getTalent(talentId).sort;
    }
}