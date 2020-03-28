import { Collection } from '../Collection';
import { HeroesDataApi } from '../../apis/HeroesToolChest/heroes-data/api';
import * as DTOs from '../../apis/HeroesToolChest/heroes-data/dtos/index';
import * as Models from './models/index';
import { Cache } from 'angular-worker-proxy';
import { HeroesTalentsApi } from '../../apis/heroespatchnotes/heroes-talents/heroes-talents.api';
import { IGameStrings } from '../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { HeroStringsUtil } from './HeroStringsUtil';
import { IHeroListItem } from './models/index';

export interface IHeroRecord extends DTOs.IHero {
    id: string;
    heroId: string;
    shortName: string;
}

export class HeroesCollection extends Collection<IHeroRecord> {

    private apiData: HeroesDataApi;
    private apiTalents: HeroesTalentsApi;

    public async getHeroIds(): Promise<string[]> {
        await this.initialize();
        return this.query.select(_ => _.id).toArray();
    }

    private createUnit(heroData: DTOs.IUnit, gamestrings: IGameStrings): Models.IUnit {
        const hid = heroData.hyperlinkId;
        const unit: Models.IUnit = {
            linkId: heroData.hyperlinkId,
            innerRadius: heroData.innerRadius,
            
            radius: heroData.radius,
            sight: heroData.sight,
            speed: heroData.speed,
            life: heroData.life,
            weapons: heroData.weapons,
            energy: heroData.energy,
            portraits: heroData.portraits,
            tags: heroData.descriptors,
            abilities: [],

            energytype: gamestrings.unit.energytype[hid],

            name: gamestrings.unit.name[hid],

        } as Models.IUnit;
        for (const type in heroData.abilities) {
            if (heroData.abilities.hasOwnProperty(type)) {
                const typedAbil = heroData.abilities[type] as DTOs.IAbility[];
                for (const abil of typedAbil) {
                    const stringKey = this.getAbilityStringId(abil);
                    
                    const ability = {
                        id: abil.nameId,
                        type: 'ability',
                        tooltipId: abil.buttonId,
                        button: abil.abilityType,
                        icon: abil.icon,
                        charges: abil.charges,

                        name: gamestrings.abiltalent.name[stringKey],
                        description: gamestrings.abiltalent.full[stringKey],
                        shortDescription: gamestrings.abiltalent.short[stringKey],
                        cooldownDescription: this.prepareGameString(gamestrings.abiltalent.cooldown[stringKey]),
                        cooldown: HeroStringsUtil.parseCooldown(gamestrings.abiltalent.cooldown[stringKey]),
                        energyCostDescription: this.prepareGameString(gamestrings.abiltalent.energy[stringKey]),
                        energyCost: HeroStringsUtil.parseEnergyCost(gamestrings.abiltalent.energy[stringKey]),
                        // is localized, but don't want to load en locale
                        energyCostType: HeroStringsUtil.parseEnergyType(gamestrings.abiltalent.energy[stringKey]),
                        lifeCostDescription: this.prepareGameString(gamestrings.abiltalent.life[stringKey]),
                        lifeCost: HeroStringsUtil.parseLifeCost(gamestrings.abiltalent.life[stringKey]),
                    } as Models.IAbility;
                    gamestrings.abiltalent.energy
                    unit.abilities.push(ability);
                }
            }
        }
        return unit;
    }
    private getAbilityStringId(ability: DTOs.IAbilityBase): string {
        return `${ability.nameId}|${ability.buttonId}|${ability.abilityType}|${ability.isPassive ? 'True' : 'False'}`;
    }

    //"<img path="@UI/StormTalentInTextQuestIcon" alignment="uppermiddle" color="B48E4C" width="20" height="22"/><span style="color:#e4b800">Quest:</span> Each time an enemy Hero with <span style="color:#bfd4fd">3</span> stacks of Banshee's Curse is hit by Shadow Dagger, its damage is permanently increased by <span style="color:#bfd4fd">0.5%</span>."
    // "<img path="@UI/StormTalentInTextQuestIcon" alignment="uppermiddle" color="B48E4C" width="20" height="22"/><span style="color:#e4b800">Quest:</span> Play Lúcio's Crossfade tracks to nearby allies for a total of <span style="color:#bfd4fd">8</span> minutes. Multiple allies provide additional time.<n/><n/><img path="@UI/StormTalentInTextQuestIcon" alignment="uppermiddle" color="B48E4C" width="20" height="22"/><span style="color:#e4b800">Reward:</span> Permanently increase Crossfade's range by <span style="color:#bfd4fd">20%</span>."
    private prepareGameString(gamestring: string): string {
        return gamestring
            ?.replace(/<c val="([0-9a-f]+)">(.*?)<\/c>/g, '<span style="color:#$1">$2</span>')
            .replace(/ path="@UI\/(.*?)" /g, ' src="assets/icons/tooltips/$1.png" ')
            ;
    }
    private createTalents(talentData: DTOs.ITalents, gamestrings: IGameStrings): Models.ITalents {
        const tiers: Models.ITalents = {};
        for (const tierKey in talentData) {
            const tierData = talentData[tierKey] as DTOs.ITalent[];
            const tier: Models.ITalent[] = [];
            for (const talentData of tierData) {
                const stringKey = this.getAbilityStringId(talentData);
                const talent = {
                    id: talentData.nameId,
                    type: 'talent',
                    tier: +tierKey.match(/[\d]+/)[0],
                    tooltipId: talentData.buttonId,
                    button: talentData.abilityType,
                    sort: talentData.sort,
                    icon: talentData.icon,
                    abilityTalentLinkIds: talentData.abilityTalentLinkIds,
                    isQuest: talentData.isQuest || false,
                    isActive: talentData.isActive || false,
                    isPassive: talentData.isPassive || talentData.abilityType === 'Passive' || false,
                    charges: talentData.charges,
                    prerequisiteTalentIds: talentData.prerequisiteTalentIds,
                    toggleCooldown: talentData.toggleCooldown,
                    name: gamestrings.abiltalent.name[stringKey],
                    shortDescription: gamestrings.abiltalent.short[stringKey],
                    description: gamestrings.abiltalent.full[stringKey],
                    cooldownDescription: gamestrings.abiltalent.cooldown[stringKey],
                    cooldown: HeroStringsUtil.parseCooldown(gamestrings.abiltalent.cooldown[stringKey]),
                    energyCostDescription: gamestrings.abiltalent.energy[stringKey],
                    energyCost: HeroStringsUtil.parseEnergyCost(gamestrings.abiltalent.energy[stringKey]),
                    energyCostType: HeroStringsUtil.parseEnergyType(gamestrings.abiltalent.energy[stringKey]),
                    lifeCostDescription: gamestrings.abiltalent.life[stringKey],
                    lifeCost: HeroStringsUtil.parseLifeCost(gamestrings.abiltalent.life[stringKey]),
                } as Models.ITalent;
                switch (talent.button) {
                    case 'Passive':
                        talent.button = undefined;
                        break;
                    case 'Active':
                        talent.button = '#';
                }
                tier.push(talent);
            }
            tiers[tierKey] = tier;
        }
        return tiers;
    }
 
    public async getHero(id: string): Promise<Models.IHero> {
        await this.initialize();
        //console.time('');
        const hero = this.query.first(_ => _.id === id);
        console.time(`HeroesCollection.getHero('${id}')`);
        const strings = (await this.apiData.getGameStrings()).gamestrings;
        console.timeEnd(`HeroesCollection.getHero('${id}')`);
        
        const hid = hero.heroId;
        const hdata: Models.IHero = {
            id: hero.id,
            heroId: hid,
            title: strings.unit.title[hid],
            description: strings.unit.description[hid],
            searchText: strings.unit.searchtext[hid],
            difficulty: strings.unit.difficulty[hid],
            energytype: strings.unit.energytype[hid],
            damagetype: strings.unit.damagetype[hid],
            lifetype: strings.unit.lifetype[hid],
            shieldtype: strings.unit.shieldtype[hid],
            linkId: hero.hyperlinkId,
            attributeId: hero.attributeId,
            expandedRole: strings.unit.expandedrole[hid],
            name: strings.unit.name[hid],
            releaseDate: hero.releaseDate,
            //releasePatch: talents.releasePatch,
            role: strings.unit.role[hid],
            tags: hero.descriptors,
            type: strings.unit.type[hid],
            units: {},
            ratings: hero.ratings,
            rarity: hero.rarity,
            franchise: hero.franchise,
            gender: hero.gender,
            talents: this.createTalents(hero.talents, strings)
        };
        console.time(`construct main unit`);
        const mainUnit = this.createUnit(hero, strings);
        hdata.units[hdata.linkId] = mainUnit;
        console.timeEnd(`construct main unit`);
        console.time(`construct other units`);
        if (hero.heroUnits) {
            for (const k of hero.heroUnits) {
                for (const key in k) {
                    if (k.hasOwnProperty(key)) {
                        console.time(`construct unit ` + key);
                        const unit = this.createUnit(k[key], strings);
                        hdata.units[key] = unit;
                        console.timeEnd(`construct unit ` + key);
                    }
                }
            }
        }
        console.timeEnd(`construct other units`);
        
        return hdata;
    }


    public async getHeroList():Promise<IHeroListItem[]>{
        await this.initialize();
        const strings = (await this.apiData.getGameStrings()).gamestrings;
        return this.query.select(hero => {
            const hid = hero.heroId;
            return {
                id: hero.id,
                franchise: hero.franchise,
                gender: hero.gender,
                releaseDate: hero.releaseDate,
                rarity: hero.rarity,
                ratings: hero.ratings,
                portraits: hero.portraits,
                role: strings.unit.role[hid],
                type: strings.unit.type[hid],
                title: strings.unit.title[hid],
                expandedRole: strings.unit.expandedrole[hid],
                name: strings.unit.name[hid],
                difficulty: strings.unit.difficulty[hid],
                description: strings.unit.description[hid],
                searchText: strings.unit.searchtext[hid],
                tags: hero.descriptors
            } as IHeroListItem; 
        }).toArray();
    }


    /*
        public getHeroById(id: string): IHeroRecord {
            return this.query.first(_ => _.id === id);
        }

        public getHeroByUnitId(id: string): IHeroRecord {
            return this.query.first(_ => _.unitId === id);
        }

        public getHeroByUnitId(id: string): IHeroRecord {
            return this.query.first(_ => _.unitId === id);
        }

        public getHeroByAttributeId(id: string): IHeroRecord {
            return this.query.first(_ => _.attributeId === id);
        }

        public getHeroByHyperlinkId(id: string): IHeroRecord {
            return this.query.first(_ => _.hyperlinkId === id);
        }

        public getHeroByShortName(name: string): IHeroRecord {
            return this.query.first(_ => _.shortName === name);
        }
    */
    @Cache()
    public async initialize(): Promise<void> {
        console.time('HeroesCollection.initialize');
        this.apiData = HeroesDataApi.getVersion(this.db.version, this.db.lang);
        
        //this.apiTalents = HeroesTalentsApi.getVersion(this.db.version);
        const heroes = await this.apiData.getHeroes();
        this.records = [];
        for (const key in heroes) {
            if (heroes.hasOwnProperty(key)) {
                const heroData = heroes[key] as IHeroRecord;
                heroData.heroId = key;
                const id = this.normalizeHeroName(heroData.hyperlinkId).toLowerCase();
                heroData.id = id;
                heroData.shortName = id;
                this.records.push(heroData);
            }
        }
        console.timeEnd('HeroesCollection.initialize');
    }
    public get version(){
        return (async()=>{
            await this.initialize();
            return (await this.apiData.dataVersion).value;
        })();
    }

    public normalizeHeroName(name: string): string {
        return name?.replace(/[ÀÁÂÃÄÅ]/g, "A")
            .replace(/[àáâãäå]/g, "a")
            .replace(/[ÈÉÊËĒĔĖĘĚ]/g, "E")
            .replace(/[èéêëēĕėęě]/g, "e")
            .replace(/[ÌÍÎÏĨĬĮİ]/g, "I")
            .replace(/[ìíîïĩīĭį]/g, "i")
            .replace(/[ÒÓÔÕÖŌŎŐ]/g, "O")
            .replace(/[òóôõöōŏő]/g, "o")
            .replace(/[ÙÚÛÜŨŪŬŮŰ]/g, "U")
            .replace(/[ùúûüũūŭůű]/g, "u")
            .replace(/[^a-z0-9]/gi, '');
    }
}
