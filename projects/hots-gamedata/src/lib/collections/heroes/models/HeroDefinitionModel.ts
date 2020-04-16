import { IHeroRecord } from '../IHeroRecord';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { UnitDefinitionModel } from './UnitDefinitionModel';
import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';
import { TalentDefinitionModel } from './TalentDefinitionModel';
import { AbilityDefinitionModel } from './AbilityDefinitionModel';

export class HeroDefinitionModel extends UnitDefinitionModel<IHeroRecord>{
    private _formIds: string[] = [];
    private _forms: UnitDefinitionModel[] = [];
    private _currentFormId: string;

   

    public constructor(data: IHeroRecord, gamestrings: IGameStrings, gamestringsLocalized: IGameStrings) {
        super(data, gamestrings, gamestringsLocalized);

        /*for (const tierStr in this.data.talents) {
            if (this.data.talents.hasOwnProperty(tierStr)) {
                const tierTalents = this.data.talents[tierStr] as DTOs.ITalent[];
                const tier = +tierStr.substr(5);
                for (const talent of tierTalents) {
                    this._talents.push(new TalentDefinitionModel(tier, talent, gamestrings, gamestringsLocalized));
                }
            }
        }
        /*
          const talents:TalentDefinitionModel[] = [];
          */
        this._forms.push(new UnitDefinitionModel(data, gamestrings, gamestringsLocalized, data));
        this._formIds.push(data.hyperlinkId);
        if (data.heroUnits) {
            for (const u of data.heroUnits) {
                for (const unitId in u) {
                    if (u.hasOwnProperty(unitId)) {
                        const unit = u[unitId];
                        this._forms.push(new UnitDefinitionModel(unit, gamestrings, gamestringsLocalized, data));
                        this._formIds.push(unit.hyperlinkId);
                    }
                }
            }
        }
    }

    public get id(): string {
        return this.data.id;
    }

    public get shortName(): string {
        return this.data.shortName;
    }

    public get attributeId(): string {
        return this.data.attributeId;
    }
    public get rarity(): string {
        return this.data.rarity;
    }
    public get franchise(): string {
        return this.data.franchise;
    }

    public get gender(): string {
        return this.data.gender;
    }

    public get expandedRoleId(): string {
        return this.gamestrings.unit.expandedrole[this.heroId];
    }
    public get expandedRole(): string {
        return this.gamestringsLocalized.unit.expandedrole[this.heroId];
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

    public get title(): string {
        return this.gamestringsLocalized.unit.title[this.heroId];
    }

    public get typeId(): string {
        return this.gamestrings.unit.type[this.heroId];
    }

    public get type(): string {
        return this.gamestringsLocalized.unit.type[this.heroId];
    }


    public get forms(): UnitDefinitionModel[] {
        return this._forms;
    }

    public get currentFormId(): string {
        return this._currentFormId;
    }
    
    public set currentFormId(value: string) {
        this.setCurrentFormId(value);
    }
    protected setCurrentFormId(value: string){
        if (this._currentFormId !== value) {
            if (this._formIds.indexOf(value) === -1) {
                throw new Error(`Hero '${this.name}' does not have a form with the id '${value}'`)
            }
            this._currentFormId = value;
        }
    }

    public get currentForm(): UnitDefinitionModel {
        if (!this.currentFormId) {
            return this._forms[0];
        }
        return this._forms.find(_ => _.linkId === this.currentFormId);
    }

    public get energy(): DTOs.IEnergy {
        return this.currentForm.energy;
    }

    public get innerRadius(): number {
        return this.currentForm.innerRadius;
    }

    public get life(): DTOs.ILife {
        return this.currentForm.life;
    }

    public get portraits(): DTOs.IPortraits {
        return Object.assign({}, this.data.portraits, this.currentForm.portraits);
    }

    public get radius(): number {
        return this.currentForm.radius;
    }

    public get sight(): number {
        return this.currentForm.sight;
    }

    public get speed(): number {
        return this.currentForm.speed;
    }

    public get weapons(): DTOs.IWeapon[] {
        return this.currentForm.weapons;
    }

    public get damageTypeId(): string {
        return this.currentForm.damageTypeId;
    }
    public get damageType(): string {
        return this.currentForm.damageType;
    }

    public get description(): string {
        return this.currentForm.description;
    }
    public get difficultyId(): string {
        return this.currentForm.difficultyId;
    }

    public get energyTypeId(): string {
        return this.currentForm.energyTypeId;
    }
    public get energyType(): string {
        return this.currentForm.energyType;
    }

    public get lifeTypeId(): string {
        return this.currentForm.lifeTypeId;
    }

    public get lifeType(): string {
        return this.currentForm.lifeType;
    }

    public get name(): string {
        return this.currentForm.name;
    }

    public get heroName(): string {
        return this.gamestringsLocalized.unit.name[this.heroId];
    }

    public get displayName(): string {
        return this.name === this.heroName ? this.heroName : `${this.heroName} (${this.name})`;
    }

    public get shieldTypeId(): string {
        return this.currentForm.shieldTypeId;
    }

    public get shieldType(): string {
        return this.currentForm.shieldType;
    }
    public get abilities(): AbilityDefinitionModel[] {
        return this.currentForm.abilities;
    }

   


}