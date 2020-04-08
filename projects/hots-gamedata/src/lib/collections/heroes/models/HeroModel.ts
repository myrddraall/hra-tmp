import { IBasicHeroModel } from './IBasicHeroModel';
import { IEnergy, IHero, ILife, IPortraits, IRatings, ITalents, IAbility, IUnit, IUnits, ITalent, ISubAbility } from './IHero';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import linq from 'linq';
import { IEnumerable } from 'linq';


export type TalentTeir = '1' | '4' | '7' | '10' | '13' | '16' | '20';


export class HeroModel implements IBasicHeroModel {

    private _levelSubject: BehaviorSubject<number> = new BehaviorSubject(1);
    private _formSubject: BehaviorSubject<string>;
    private _talentsSubject: Subject<void> = new Subject();

    private _selectedTalentIndecies: { [tier: string]: number } = {
        '1': -1,
        '4': -1,
        '7': -1,
        '10': -1,
        '13': -1,
        '16': -1,
        '20': -1
    };

    public get levelChange(): Observable<number> {
        return this._levelSubject;
    }

    public get formChange(): Observable<string> {
        return this._formSubject;
    }

    public get talentsChange(): Observable<void> {
        return this._talentsSubject;
    }

    public constructor(private readonly data: IHero) {
        this._formSubject = new BehaviorSubject(data.linkId);

    }


    public get level(): number {
        return this._levelSubject.value;
    }

    public set level(value: number) {
        value = Math.max(0, Math.min(30, value || 0));
        if (this.level !== value) {
            this._levelSubject.next(value);
        }
    }

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

    public get difficulty(): string {
        return this.data.difficulty;
    }

    public get searchText(): string {
        return this.data.searchText;
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
        if (this.formId !== value) {
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

    public findTalent(predicate: (talent: ITalent, index: number) => boolean): ITalent {
        return this.findTalentsQuery.where(predicate).firstOrDefault();
    }

    public findTalents(predicate: (talent: ITalent, index: number) => boolean): ITalent[] {
        return this.findTalentsQuery.where(predicate).toArray();
    }

    public findTalentById(id: String) {
        return this.findTalent(talent => talent.id === id);
    }


    public get abilities(): Array<IAbility | ISubAbility> {
        return this.data.units[this.formId].abilities;
    }


    public get selectedTalentIndecies(): Readonly<{ [tier: string]: number }> {
        return this._selectedTalentIndecies;
    }

    public get selectedTalentIds(): Readonly<{ [tier: string]: string }> {
        const talentIds: { [tier: string]: string } = {
            '1': this.getTalentByIndex('1', this._selectedTalentIndecies['1'])?.id,
            '4': this.getTalentByIndex('4', this._selectedTalentIndecies['4'])?.id,
            '7': this.getTalentByIndex('7', this._selectedTalentIndecies['7'])?.id,
            '10': this.getTalentByIndex('10', this._selectedTalentIndecies['10'])?.id,
            '13': this.getTalentByIndex('13', this._selectedTalentIndecies['13'])?.id,
            '16': this.getTalentByIndex('16', this._selectedTalentIndecies['16'])?.id,
            '20': this.getTalentByIndex('20', this._selectedTalentIndecies['20'])?.id
        }
        return talentIds;
    }

    private talentIdToIndex(talentId: string, tier?: TalentTeir) {
        if (tier) {
            return linq.from(this.talents['level' + tier]).select((_, index) => ({ id: _.id, index })).where(_ => _.id === talentId).select(_ => _.index).firstOrDefault();
        }
        return this.findTalentsQuery.select((_, index) => ({ id: _.id, index })).where(_ => _.id === talentId).select(_ => _.index).firstOrDefault();
    }


    public setSelectedTalentIndecies(talents: { [tier: string]: number }) {
        for (const tier in talents) {
            if (talents.hasOwnProperty(tier)) {
                const talentIdx = talents[tier];
                this.selectTalentByIndex(tier as TalentTeir, talentIdx);
            }
        }
    }

    public setSelectedTalentIds(talents: { [tier: string]: string }) {
        for (const tier in talents) {
            if (talents.hasOwnProperty(tier)) {
                const talentId = talents[tier];
                this.selectTalentById(tier as TalentTeir, talentId);
            }
        }
    }

    public selectTalentById(tier: TalentTeir, talentId: string) {
        this.selectTalentByIndex(tier, this.talentIdToIndex(talentId, tier));
    }

    public selectTalentByIndex(tier: TalentTeir, talentIndex: number) {
        const prevTalentIdx = this.getSelectedTalentIndex(tier);
        if (prevTalentIdx !== talentIndex) {

            const talent = this.getTalentByIndex(tier, talentIndex);
            const prevTalent = this.getTalentByIndex(tier, prevTalentIdx);

            // deselect any talents that had the previously selected talent as a requirement
            if (prevTalent) {
                const dependantTalents = this.findTalents(t => {
                    if (!t.prerequisiteTalentIds || t.prerequisiteTalentIds.indexOf(prevTalent.id) === -1) {
                        return false;
                    }
                    return true;
                });
                for (const dtalent of dependantTalents) {
                    const dtier = dtalent.tier;
                    const didx = this.talentIdToIndex(dtalent.id, dtier.toString() as TalentTeir);
                    if (this._selectedTalentIndecies[dtier] === didx) {
                        this._selectedTalentIndecies[dtier] = -1;
                    }
                }
            }
            // select the talent
            this._selectedTalentIndecies[tier] = talentIndex;

            // select talents required by this talent
            if (talent.prerequisiteTalentIds) {
                for (const id of talent.prerequisiteTalentIds) {
                    const preTalent = this.findTalentById(id);
                    const preTalentIdx = this.talentIdToIndex(id, preTalent.tier.toString() as TalentTeir);
                    this.selectTalentByIndex(preTalent.tier.toString() as any, preTalentIdx);
                }
            }
            this._talentsSubject.next();
        }
    }

    public get talentBuildValue(): number {
        let value = 0;
        let i = 0;
        for (const tier in this.selectedTalentIndecies) {
            if (this.selectedTalentIndecies.hasOwnProperty(tier)) {
                const selectedIndex = this.selectedTalentIndecies[tier];
                let tierIdx = 0;
                for (const talent of this.talents['level' + tier]) {
                    if (selectedIndex === tierIdx) {
                        value += 1 << i;
                    }
                    tierIdx++;
                    i++;
                }
            }
        }
        return value;
    }

    public set talentBuildValue(value: number) {
        this._selectedTalentIndecies = {
            '1': -1,
            '4': -1,
            '7': -1,
            '10': -1,
            '13': -1,
            '16': -1,
            '20': -1
        };
        let i = 0;
        for (const tier in this.selectedTalentIndecies) {
            if (this.selectedTalentIndecies.hasOwnProperty(tier)) {
                let tierIdx = 0;
                for (const talent of this.talents['level' + tier]) {
                    const talentFlag = 1 << i;
                    if ((value & talentFlag) === talentFlag) {
                        this.selectTalentByIndex(tier as TalentTeir, tierIdx);
                    }
                    tierIdx++;
                    i++;
                }
            }
        }
    }

    public get talentBuildUrl(): string {
        return this.talentBuildValue.toString(36);
    }

    public set talentBuildUrl(value: string) {
        this.talentBuildValue = parseInt(value, 36);
    }

    public getSelectedTalentIndex(tier: TalentTeir) {
        return this._selectedTalentIndecies[tier];
    }

    public getSelectedTalent(tier: TalentTeir) {
        return this.getTalentByIndex(tier, this.getSelectedTalentIndex(tier));
    }

    public get selectedTalents() {
        return [
            this.getSelectedTalent('1'),
            this.getSelectedTalent('4'),
            this.getSelectedTalent('7'),
            this.getSelectedTalent('10'),
            this.getSelectedTalent('13'),
            this.getSelectedTalent('16'),
            this.getSelectedTalent('20')
        ];
    }

    public getSelectedTalentId(tier: TalentTeir) {
        return this.getTalentByIndex(tier, this.getSelectedTalentIndex(tier))?.id;
    }

    public isSelectedTalentIndex(tier: TalentTeir, index: number) {
        return this._selectedTalentIndecies[tier] === index && index !== undefined;
    }

    public isSelectedTalentId(id: string, tier?: TalentTeir) {
        if (!tier) {
            tier = this.findTalentById(id)?.tier.toString() as TalentTeir;
        }
        return this.isSelectedTalentIndex(tier, this.talentIdToIndex(id, tier));
    }

    public isSelectedTalentAbilityId(id: string) {
        const talents = this.findTalents(_ => _.abilityTalentLinkIds ? _.abilityTalentLinkIds.indexOf(id) !== -1 : false);
        if (talents?.length) {
            for (const talent of talents) {
                if (this.isSelectedTalentId(talent?.id)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    public getTalentByIndex(tier: TalentTeir, index: number) {
        return this.talents['level' + tier][index];
    }

    public getSelectedTalentsForAbility(id: string) {
        return linq.from(this.selectedTalents).where(_ => _?.abilityTalentLinkIds ? _.abilityTalentLinkIds.indexOf(id) !== -1 : false).toArray();
    }

    public get currentAbilities(): Array<IAbility | ISubAbility> {
        const selectedTalents = linq.from(this.selectedTalents);
        const abilities = linq.from(this.data.units[this.formId].abilities)
            .concat(selectedTalents
                .where(_ => _ && _.button === '#' && !_.prerequisiteTalentIds?.length)
                .select(_ => ({ ..._, button: 'Active' } as unknown as IAbility)))
            .select(_ => {
                const abil = {..._} as IAbility & { isEnabledByTalent: boolean };
                const talents = selectedTalents.where(t => t && t?.abilityTalentLinkIds.indexOf(_?.id) !== -1).toArray();
           //     console.log('ability talents', _.id, talents);
                for (const talent of talents) {
                    if(talent.isActive){
                        abil.isActive = talent.isActive;
                        abil.charges = talent.charges;
                        abil.cooldown = talent.cooldown;
                        abil.cooldownDescription = talent.cooldownDescription;
                        abil.energyCost = talent.energyCost;
                        abil.energyCostDescription = talent.energyCostDescription;
                        abil.energyCostType = talent.energyCostType;
                        abil.lifeCost = talent.lifeCost;
                        abil.lifeCostDescription = talent.lifeCostDescription;
                        abil.isEnabledByTalent = true;
                    }
                }
                return abil;
            })
            .groupJoin(selectedTalents,
                o => o.id, i => i?.id,
                (ability, talent) => {
                    return {
                        ...ability,
                        isEnabledByTalent: !!talent.firstOrDefault()
                    } as IAbility & { isEnabledByTalent: boolean };
                }
            )
            .groupJoin(selectedTalents,
                o => o.id, i => i?.tooltipId,
                (ability, talent) => {
                    return {
                        ...ability,
                        isEnabledByTalent: ability.isEnabledByTalent  ? true : !!talent.firstOrDefault()
                    } as IAbility & { isEnabledByTalent: boolean };
                }
            )
            .orderByDescending(_ => _.isEnabledByTalent)


      //  console.log('+++++++++++++++++++', abilities.toArray(), this.talents);
        return abilities.toArray();
    }

    public get abilityQ() {
        return this.currentAbilities.find(_ => _.button.toUpperCase() === 'Q' && _.type === 'ability')
    }

    public get abilityW() {
        return this.currentAbilities.find(_ => _.button.toUpperCase() === 'W' && _.type === 'ability')
    }

    public get abilityE() {
        return this.currentAbilities.find(_ => _.button.toUpperCase() === 'E' && _.type === 'ability')
    }
    public get abilityZ() {
        return this.currentAbilities.find(_ => _.button.toUpperCase() === 'Z' && _.type === 'ability')
    }

    public get abilityB() {
        return this.currentAbilities.find(_ => _.button.toUpperCase() === 'B' && _.type === 'ability')
    }

    public get abilityR() {
        const heroics = this.findActiveHeroics();
        return heroics[0];
    }

    private findActiveHeroics() {
        return this.currentAbilities.filter(_ => {
            return _.button === 'Heroic' && _.type === 'ability' && this.isSelectedTalentAbilityId(_.id);
        });
    }

    public get abilityD() {
        const heroics = this.findActiveHeroics();
        if (heroics.length === 2) {
            return {
                ...heroics[1],
                button: 'Trait'
            };
        }
        return this.currentAbilities.find(_ => _.button === 'Trait' )
    }

    public get abilitiesActive() {
        return this.currentAbilities.filter(_ => _.button === 'Active')
    }
}
