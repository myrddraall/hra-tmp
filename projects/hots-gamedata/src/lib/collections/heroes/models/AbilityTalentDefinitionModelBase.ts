import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { HeroStringsUtil } from '../HeroStringsUtil';
import { AbilityType } from '../../../apis/HeroesToolChest/heroes-data/dtos/AbilityType';

export class AbilityTalentDefinitionModelBase<TData extends DTOs.IAbility | DTOs.ITalent> {

    constructor(
        protected readonly data: TData,
        protected readonly gamestrings: IGameStrings,
        protected readonly gamestringsLocalized: IGameStrings
    ) {

    }

    public get tooltipId(): string {
        return this.data.buttonId;
    }

    public get icon(): string {
        return this.data.icon;
    }

    public get isActive(): boolean {
        return this.data.isActive !== false;
    }

    public get isPassive(): boolean {
        return this.data.isPassive === undefined ? !this.isActive : this.data.isPassive;
    }
    

    public get id(): string {
        return this.data.nameId;
    }

    protected get gameStringId(): string {
        return `${this.data.nameId}|${this.data.buttonId}|${this.data.abilityType}|${this.data.isPassive ? 'True' : 'False'}`;
    }

    public get charges(): DTOs.ICharges {
        return this.data.charges;
    }

    public get name(): string {
        return this.gamestringsLocalized.abiltalent.name[this.gameStringId];
    }

    public get energyCostDescription(): string {
        return this.gamestringsLocalized.abiltalent.energy[this.gameStringId];
    }
    public get energyCost(): number {
        return HeroStringsUtil.parseEnergyCost(this.gamestrings.abiltalent.energy[this.gameStringId]);
    }

    public get energyCostTypeId(): string {
        return HeroStringsUtil.parseEnergyType(this.gamestrings.abiltalent.energy[this.gameStringId]);
    }

    public get energyCostType(): string {
        return HeroStringsUtil.parseEnergyType(this.energyCostDescription);
    }

    public get lifeCostDescription(): string {
        return this.gamestringsLocalized.abiltalent.life[this.gameStringId];
    }

    public get lifeCost(): number {
        return HeroStringsUtil.parseEnergyCost(this.gamestrings.abiltalent.life[this.gameStringId]);
    }

    public get lifeCostTypeId(): string {
        return HeroStringsUtil.parseEnergyType(this.gamestrings.abiltalent.life[this.gameStringId]);
    }

    public get lifeCostType(): string {
        return HeroStringsUtil.parseEnergyType(this.lifeCostDescription);
    }

    public get cooldownDescription(): string {
        return this.gamestringsLocalized.abiltalent.cooldown[this.gameStringId];
    }

    public get cooldown(): number {
        return HeroStringsUtil.parseCooldown(this.cooldownDescription);
    }

    public get description(): string {
        return this.gamestringsLocalized.abiltalent.full[this.gameStringId];
    }

    public get shortDescription(): string {
        return this.gamestringsLocalized.abiltalent.short[this.gameStringId];
    }

    public get hotkey(): string {
        switch (this.data.abilityType) {
            case AbilityType.Q:
            case AbilityType.W:
            case AbilityType.E:
                return this.data.abilityType;
            case AbilityType.Heroic:
                return 'R';
            case AbilityType.Trait:
                return this.isActive === false ? '' : 'D';
            case AbilityType.Active:
                    return '#';
            case AbilityType.Z:
                return this.isActive === false ? '' : 'Z';
            case AbilityType.B:
                return 'B';
            default:
                return '';
        }
    }

    public get abilityButton(): DTOs.AbilityType {
        return this.data.abilityType;
    }

}