import { HeroDefinitionModel } from './HeroDefinitionModel';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IHeroRecord } from 'hots-gamedata/lib';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import linq from 'linq';
import { TalentTeir } from './TalentTeir';
import { TalentDefinitionModel } from './TalentDefinitionModel';
import { AbilityDefinitionModel } from './AbilityDefinitionModel';
import { AbilityType } from '../../../apis/HeroesToolChest/heroes-data/dtos';

export class HeroModel2 extends HeroDefinitionModel {
    private _levelSubject: BehaviorSubject<number> = new BehaviorSubject(1);
    private _formSubject: BehaviorSubject<string>;
    private _talentsSubject: Subject<void> = new Subject();

    private _selectedTalentIndecies: { [tier: number]: number } = {
        1: -1,
        4: -1,
        7: -1,
        10: -1,
        13: -1,
        16: -1,
        20: -1
    };

    public constructor(data: IHeroRecord, gamestrings: IGameStrings, gamestringsLocalized: IGameStrings) {
        super(data, gamestrings, gamestringsLocalized);
        this._formSubject = new BehaviorSubject(data.hyperlinkId);
        this.talents
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

    public get levelChange(): Observable<number> {
        return this._levelSubject;
    }

    protected setCurrentFormId(value: string) {
        if (this.currentFormId !== value) {
            super.setCurrentFormId(value);
            this._formSubject.next(value);
        }
    }

    public get formChange(): Observable<string> {
        return this._formSubject;
    }


    public get selectedTalentIndecies(): Readonly<{ [tier: number]: number }> {
        return this._selectedTalentIndecies;
    }

    public get selectedTalentsChange(): Observable<void> {
        return this._talentsSubject;
    }

    protected get talentQuery() {
        return linq.from(this.talents)
    }


    public getSelectedTalentIndex(tier: TalentTeir): number {
        return this._selectedTalentIndecies[tier];
    }

    public getSelectedTalent(tier: TalentTeir): TalentDefinitionModel {
        return this.getTalent(tier, this.getSelectedTalentIndex(tier));
    }

    public getSelectedTalentId(tier: TalentTeir): string {
        return this.getSelectedTalent(tier)?.id;
    }


    public isTalentSelected(talent: TalentDefinitionModel): boolean;
    public isTalentSelected(id: string): boolean;
    public isTalentSelected(tier: TalentTeir, index: number): boolean;
    public isTalentSelected(idTeirOrTalent: string | TalentTeir | TalentDefinitionModel, index?: number): boolean {
        if (idTeirOrTalent instanceof TalentDefinitionModel) {
            return this._selectedTalentIndecies[idTeirOrTalent.tier] === idTeirOrTalent.sort;
        }
        if (typeof idTeirOrTalent === 'string') {
            const talent = this.getTalent(idTeirOrTalent);
            return this._selectedTalentIndecies[talent.tier] === talent.sort;
        }
        return this._selectedTalentIndecies[idTeirOrTalent] === index;
    }


    public get selectedTalents(): TalentDefinitionModel[] {
        return [
            this.getSelectedTalent(1),
            this.getSelectedTalent(4),
            this.getSelectedTalent(7),
            this.getSelectedTalent(10),
            this.getSelectedTalent(13),
            this.getSelectedTalent(16),
            this.getSelectedTalent(20)
        ];
    }

    public selectTalent(talent: TalentDefinitionModel): void;
    public selectTalent(id: string): void;
    public selectTalent(tier: TalentTeir, index: number): void;
    public selectTalent(idTeirOrTalent: string | TalentTeir | TalentDefinitionModel, index?: number): void {
        if (idTeirOrTalent instanceof TalentDefinitionModel) {
            this.selectTalentByIndex(idTeirOrTalent.tier, idTeirOrTalent.sort)
        } else if (typeof idTeirOrTalent === 'string') {
            const talent = this.getTalent(idTeirOrTalent);
            this.selectTalentByIndex(talent.tier, talent.sort)
        } else {
            if (index === undefined || index === null) {
                index = -1;
            }
            this.selectTalentByIndex(idTeirOrTalent, index);
        }
    }

    private selectTalentByIndex(tier: TalentTeir, talentIndex: number) {
        const prevTalentIdx = this.getSelectedTalentIndex(tier);
        if (prevTalentIdx !== talentIndex) {

            const talent = this.getTalent(tier, talentIndex);
            const prevTalent = this.getTalent(tier, prevTalentIdx);

            // deselect any talents that had the previously selected talent as a requirement
            if (prevTalent) {
                const dependantTalents = this.talentQuery.where(t => {
                    if (!t.prerequisiteTalentIds || t.prerequisiteTalentIds.indexOf(prevTalent.id) === -1) {
                        return false;
                    }
                    return true;
                });
                for (const dtalent of dependantTalents) {
                    const dtier = dtalent.tier;
                    const didx = this.talentIdToIndex(dtalent.id);
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
                    const preTalent = this.getTalent(id);
                    const preTalentIdx = this.talentIdToIndex(id);
                    this.selectTalentByIndex(preTalent.tier, preTalentIdx);
                }
            }
            this._talentsSubject.next();
        }
    }


    public getSelectedTalentsForAbility(id: string): TalentDefinitionModel[];
    public getSelectedTalentsForAbility(ability: AbilityDefinitionModel): TalentDefinitionModel[];
    public getSelectedTalentsForAbility(idOrAbility: string | AbilityDefinitionModel): TalentDefinitionModel[] {
        if (idOrAbility instanceof AbilityDefinitionModel) {
            const abiltype = idOrAbility.abilityType;
            const abilbutton = idOrAbility.abilityButton;
            const q = linq.from(this.selectedTalents)
                .where(_ =>
                    (_?.abilityButton === AbilityType.Passive && idOrAbility.abilityType === 'trait' && !_?.abilityTalentLinkIds)
                    || (idOrAbility.abilityType !== 'activale' && _?.abilityButton === abilbutton)
                    || (_?.abilityTalentLinkIds ? _.abilityTalentLinkIds.indexOf(idOrAbility.id) !== -1 : false)
                )
                .where(_ => _?.id !== idOrAbility.id && _?.tooltipId !== idOrAbility.tooltipId);
            return q.toArray();
        }
        return this.getSelectedTalentsForAbility(this.getAbility(idOrAbility));
    }


    public get talentBuildValue(): number {
        let value = 0;
        let i = 0;
        for (const talent of this.talents) {
            if (this.isTalentSelected(talent)) {
                value += 1 << i;
            }
            i++;
        }
        /*for (const tier in this.selectedTalentIndecies) {
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
        }*/
        return value;
    }

    public set talentBuildValue(value: number) {
        this._selectedTalentIndecies = {
            1: -1,
            4: -1,
            7: -1,
            10: -1,
            13: -1,
            16: -1,
            20: -1
        };
        let i = 0;

        for (const talent of this.talents) {
            const talentFlag = 1 << i;
            if ((value & talentFlag) === talentFlag) {
                this.selectTalent(talent);
            }
            i++;
        }
        /*
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
                */
    }

    public get talentBuildUrl(): string {
        return this.talentBuildValue.toString(36);
    }

    public set talentBuildUrl(value: string) {
        this.talentBuildValue = parseInt(value, 36);
    }

    public get talentBuildIngameLink(): string {
        const talents = [];
        for (const tier in this.selectedTalentIndecies) {
            if (this.selectedTalentIndecies.hasOwnProperty(tier)) {
                const index = this.selectedTalentIndecies[tier];
                talents.push(index + 1);
            }
        }
        return `[T${talents.join('')},${this.shortName}]`;
    }

    public set talentBuildIngameLink(value: string) {
        const match = value.match(/\[T([\d]+),([A-Za-z0-9]+)\]/);
        const heroId = match[2];
        if (heroId !== this.shortName) {
            throw new Error(`'${heroId}' does not match '${this.shortName}'`);
        }

        const talents = match[1];
        let i = 0
        for (const tier in this.selectedTalentIndecies) {
            if (this.selectedTalentIndecies.hasOwnProperty(tier)) {
                const idx = +talents.charAt(i++) - 1;
                this.selectTalent(+tier as TalentTeir, idx);
            }
        }

    }

    protected get abilitiesQuery() {
        return linq.from(this.abilities);
    }
    public get activeAbilitiesQuery() {
        let buttonIds: string[] = [];
        let q = this.abilitiesQuery
            .where(_ => {
                if (_.requiresTalent) {
                    if (!this.isTalentSelected(_.requiredTalentId)) {
                        return false;
                    }
                }
                if (_.parentAbilityId) {
                    const abil = this.getAbility(_.parentAbilityId);
                    if (abil.requiresTalent) {
                        if (!this.isTalentSelected(abil.requiredTalentId)) {
                            return false;
                        }
                    }
                }
                return true;
            })
            .orderByDescending(_ => _.requiresTalent)
            .orderBy(_ => _.isSubAbility)
            .orderByDescending(_ => _.isActive)
            .select(v => {
                let k = v.abilityType;
                if (k === 'activable') {
                    if (!v.isSubAbility) {
                        buttonIds.push(v.id);
                        k = buttonIds.length.toString();
                    } else {
                        const idx = buttonIds.indexOf(v.parentAbilityId);
                        if (idx === -1) {
                            k = '-1';
                            const pAbil = this.getAbility(v.parentAbilityId);
                            console.log('check parent of sub', pAbil);
                            if (pAbil.abilityType !== 'activable') {
                                buttonIds.push(pAbil.id);
                                k = buttonIds.length.toString();
                            }
                        } else {
                            k = (idx + 1).toString();

                        }
                    }
                }
                return { k, v };
            })
            .groupBy(
                _ => _.k === 'basic' ? _.v.hotkey : _.k,
                _ => _.v,
                (k, _) => ({ k, v: _.toArray() })
            )

            .groupBy(
                _ => {
                    if (+_.k >= 0) {
                        return 'activable';
                    }
                    return _.k;
                },
                _ => _.v,
                (k, _) => {
                    if (k === 'activable') {
                        return { k, v: _.toArray() };
                    } else {
                        return { k, v: _.toArray()[0] };
                    }
                }
            )
        //   console.log(q.toArray())
        return q;
    }

    public get activeAbilities(): linq.IDictionary<string, AbilityDefinitionModel[] | AbilityDefinitionModel[][]> {
        const dict = this.activeAbilitiesQuery.toDictionary(_ => _.k, _ => _.v);
        // console.log('dict', dict);
        return dict;
    }

    public get activeAbilityZ() {
        return linq.from(this.activeAbilities.get('mount')).firstOrDefault()
    }

    public get activeAbilityB() {
        return linq.from(this.activeAbilities.get('hearth')).firstOrDefault()
    }

    public get activeAbilityQ() {
        return linq.from(this.activeAbilities.get('Q') as AbilityDefinitionModel[]).orderBy(_ => _.requiresTalent).firstOrDefault()
    }
    public get activeAbilityW() {
        return linq.from(this.activeAbilities.get('W') as AbilityDefinitionModel[]).orderBy(_ => _.requiresTalent).firstOrDefault()
    }
    public get activeAbilityE() {
        return linq.from(this.activeAbilities.get('E') as AbilityDefinitionModel[]).orderBy(_ => _.requiresTalent).firstOrDefault()
    }
    public get activeAbilityR() {
        return linq.from(this.activeAbilities.get('heroic')).firstOrDefault();
    }
    public get activeAbilityD() {
        const q = linq.from(this.activeAbilities.get('trait') as AbilityDefinitionModel[])
            .orderBy(_ => _.requiresTalent)
            .orderByDescending(_ => _.isActive)
        console.log(q.toArray());
        return q.firstOrDefault()
    }
    public get activeAbilityActivatable() {
        const result: any[] =
            linq.from(this.activeAbilities.get('activable') as AbilityDefinitionModel[][])
                .select(_ => _[0])
                .orderBy(_ => _.requiresTalent)
                .toArray();

        return result;

    }
}