import { IBasicHeroModel } from './IBasicHeroModel';
import { IEnergy, IHero, ILife, IPortraits, IRatings, ITalents, IAbility, IUnit, IUnits, ITalent } from './IHero';
import { Observable, BehaviorSubject } from 'rxjs';
import linq from 'linq';
import {IEnumerable} from 'linq';

export class HeroModel implements IBasicHeroModel {

    private _levelSubject: BehaviorSubject<number>= new BehaviorSubject(0);
    private _formSubject: BehaviorSubject<string>;

    public get levelChange():Observable<number>{
        return this._levelSubject;
    }

    public get formChange():Observable<string>{
        return this._formSubject;
    }

    public constructor(private readonly data: IHero) {
        this._formSubject = new BehaviorSubject(data.linkId);
    }


    public get level():number{
        return this._levelSubject.value;
    }

    public set level(value:number){
        value = Math.max(0, Math.min(30, value || 0));
        if(this.level !== value){
            this._levelSubject.next(value);
        }
    }

    difficulty: string;
    searchText: string;
    public get id(): string {
        return this.data.id;
    }
    public get attributeId(): string {
        return this.data.attributeId;
    }
    public get damagetype(): string {
        return this.data.damagetype;
    }
    public get description(): string {
        return this.data.description;
    }
    public get energyType(): string {
        return this.data.units[this.formId].energytype;
    }
    public get expandedRole(): string {
        return this.data.expandedRole;
    }
    public get franchise(): string {
        return this.data.franchise;
    }
    public get gender(): string {
        return this.data.gender;
    }
    public get heroId(): string {
        return this.data.heroId;
    }
    public get lifetype(): string {
        return this.data.lifetype;
    }
    public get linkId(): string {
        return this.data.linkId;
    }
    public get name(): string {
        return this.data.units[this.formId].name || this.data.name;
    }
    public get heroName(): string {
        return this.data.name;
    }

    public get formName(): string {
        return this.name === this.heroName ? this.heroName : `${this.heroName} (${this.name})`;
    }

    public get rarity(): string {
        return this.data.rarity;
    }
    public get ratings(): IRatings {
        return this.data.ratings;
    }
    public get releaseDate(): string {
        return this.data.releaseDate;
    }
    public get role(): string {
        return this.data.role;
    }
    public get shieldtype(): string {
        return this.data.shieldtype;
    }
    public get tags(): string[] {
        return this.data.tags;
    }
    public get title(): string {
        return this.data.title;
    }
    public get type(): string {
        return this.data.type;
    }
    public get formIds(): string[] {
        return Object.keys(this.data.units);
    }

    public get forms(): IUnit[] {
        return Object.values(this.data.units);
    }

    public get formId(): string {
        return this._formSubject.value || this.linkId;
    }
    public set formId(value: string) {
        if (!(this.data.units as object).hasOwnProperty(value)) {
            throw new Error(`${this.name} does not have a form named '${value}'`);
        }
        if(this.formId !== value){
            this._formSubject.next(value);
        }
    }
    public get portraits(): IPortraits {
        return Object.assign({}, this.data.units[this.linkId].portraits, this.data.units[this.formId].portraits);
    }

    public get life(): ILife {
        return this.data.units[this.formId].life;
    }

    public get energy(): IEnergy {
        return this.data.units[this.formId].energy;
    }
    public get talents(): ITalents {
        return this.data.talents;
    }

    private get findTalentsQuery(): IEnumerable<ITalent> {
        return linq.from(this.talents.level1)
            .concat(linq.from(this.talents.level4))
            .concat(linq.from(this.talents.level7))
            .concat(linq.from(this.talents.level10))
            .concat(linq.from(this.talents.level13))
            .concat(linq.from(this.talents.level16))
            .concat(linq.from(this.talents.level20));
    }

    public findTalent(predicate: (talent:ITalent, index:number)=>boolean): ITalent {
        return this.findTalentsQuery.where(predicate).firstOrDefault();
    }

    public  findTalents(predicate: (talent:ITalent, index:number)=>boolean): ITalent[] {
        return this.findTalentsQuery.where(predicate).toArray();
    }

    public findTalentById(id:String){
        return this.findTalent(talent => talent.id === id);
    }


    public get abilities(): IAbility[] {
        return this.data.units[this.formId].abilities;
    }
}
