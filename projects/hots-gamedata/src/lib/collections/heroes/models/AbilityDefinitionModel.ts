import * as DTOs from '../../../apis/HeroesToolChest/heroes-data/dtos/index';
import { IGameStrings } from '../../../apis/HeroesToolChest/heroes-data/dtos/IGameStrings';
import { HeroStringsUtil } from '../HeroStringsUtil';
import linq from 'linq';
import { AbilityTalentDefinitionModelBase } from './AbilityTalentDefinitionModelBase';
import { TalentDefinitionModel } from './TalentDefinitionModel';
import { IHeroRecord } from '../IHeroRecord';
import { IAbilityData, ITalentData } from './IAbilityData';

export class AbilityDefinitionModel extends AbilityTalentDefinitionModelBase<IAbilityData> {
    private _abilityTalentLinkIds: string[];
    private _subabilityLinkIds: string[];
    private _abilityTalentLinks: TalentDefinitionModel[];
    private _abilityTalentId: string;
    private _parentAbilityId: string;
    private _abilityTalents: any[];

    constructor(
        data: IAbilityData,
        gamestrings: IGameStrings,
        gamestringsLocalized: IGameStrings,
        protected readonly abilityList?: IAbilityData[],
        protected readonly talentList?: ITalentData[]
    ) {
        super(data, gamestrings, gamestringsLocalized);

        let subParts = data.subabilityOf ? data.subabilityOf.split('|') : [];
        let subOfNameId = subParts[0];
        let subOfButtonId = subParts[1];
        let subOfKey = subParts[2];
        /*if(subOfButtonId === data.nameId){
            subOfNameId = undefined;
            subOfButtonId = undefined;
            subOfKey = undefined;
            subParts = [];
        }*/

        const abilityQuery = linq.from(abilityList).where(_ => _ !== data);

        const parentAbility = abilityQuery
            .where(_ =>
                ///_.nameId === subOfNameId ||
                _.buttonId === subOfButtonId //||
                //_.buttonId === subOfNameId
            ).firstOrDefault();

       
        //    console.log('+++++++++++++++', data.nameId, parentAbility)
        

        this._parentAbilityId = parentAbility?.nameId;
        const talentQ = linq.from(talentList);
        
        const abilityTalentQ =  talentQ
        .where(_ => false)
        .concat(
            
            talentQ.where(_ => _.nameId === data.nameId),
            talentQ.where(_ => _.nameId === subOfNameId),
            talentQ.where(_ => _.nameId === data.nameId),
            talentQ.where(_ => _.nameId === parentAbility?.nameId),
            talentQ.where(_ => _.buttonId === subOfButtonId),
            talentQ.where(_ => _.buttonId === data.buttonId),
            talentQ.where(_ => _.buttonId === parentAbility?.buttonId),
          
         
         



         // relatedQ.where(_ => _.buttonId === parentAbility?.buttonId),
         //   relatedQ.where(_ => _.buttonId === subOfButtonId),
         //   relatedQ.where(_ => _.buttonId === data.buttonId),
        //    relatedQ.where(_ => _.nameId === data.nameId),
         //   relatedQ.where(_ => _.abilityTalentLinkIds? _.abilityTalentLinkIds[0] === data.nameId : false),
      //    //  relatedQ.where(_ => _.abilityTalentLinkIds? _.abilityTalentLinkIds[0] === data.buttonId : false),
        //    relatedQ.where(_ => _.abilityTalentLinkIds? _.abilityTalentLinkIds.indexOf(data.nameId) !== -1 : false)


        ).distinct();

        const relatedQ = abilityTalentQ.concat(
            talentQ.where(_ => _.abilityTalentLinkIds? _.abilityTalentLinkIds.indexOf(data.nameId) !== -1 : false),
            talentQ.where(_ => _.abilityTalentLinkIds? _.abilityTalentLinkIds.indexOf(parentAbility?.nameId) !== -1 : false),
        ).distinct()

      //  .where(_ => _.abilityTalentLinkIds ? _.abilityTalentLinkIds[0] === data.nameId : false);

        console.log('required', data.nameId, this._parentAbilityId, data, abilityTalentQ.toArray());

      /*  const relatedTalents = linq.from(talentList)
            .where(_ => (_.abilityTalentLinkIds ? _.abilityTalentLinkIds.indexOf(this.id) !== -1 : false) || (_.abilityTalentLinkIds ? _.abilityTalentLinkIds.indexOf(this._parentAbilityId) !== -1 : false) || _.buttonId === this.id || _.buttonId === this.tooltipId || _.nameId === this.id || _.buttonId === subOfNameId || _.nameId === subOfNameId)
            .select(_ => new TalentDefinitionModel(_, gamestrings, gamestringsLocalized, abilityList, talentList));
*/
        this._abilityTalentLinkIds = relatedQ.select(_ => _.nameId).toArray();
        let abilityTalent = abilityTalentQ.firstOrDefault();
       // const abilityTalentQ = directTalentsQ.where(_ => _.tooltipId === this.id || _.tooltipId === this.tooltipId || _.id === this.id || _.tooltipId === subOfNameId || _.id === subOfNameId);
       /* switch (data.type) {
            case 'heroic':
                abilityTalent = abilityTalentQ.firstOrDefault();
                if (!abilityTalent) {
                    abilityTalent = relatedTalents.firstOrDefault();
                }
                break;
            case 'trait':
              //  console.log('TRAIT', this.id, abilityTalentQ.toArray())
                abilityTalent = abilityTalentQ.lastOrDefault();
                if (!abilityTalent) {
           //         console.log('TRAIT2', this.id, relatedTalents.toArray())
                   // abilityTalent = relatedTalents.firstOrDefault();
                }
                break;
            default:
                abilityTalent = abilityTalentQ.lastOrDefault();
                break;
        }*/
        this._abilityTalentId = abilityTalent?.nameId;
        this._subabilityLinkIds = abilityQuery.where(_ => _.subabilityOf === this.tooltipId).select(_ => _.nameId).toArray();

        //if(!this.isSubAbility && data.subabilityOf && this.requiresTalent && this.isActive && this.abilityType === 'basic'){
        // if(this.id === subOfNameId){
        // console.log('||||||||||||||||||||||||||||||||||||||||||', this.id, this.requiredTalentId, subParts, data);
        // console.log(linq.from(abilityList).where(_ => _.nameId === subOfNameId && _.nameId !== this.id).toArray())
        // console.log(linq.from(abilityList).where(_ => _.buttonId === subOfButtonId && _.nameId !== this.id).toArray())
        //  console.log(linq.from(abilityList).where(_ => _.buttonId === subOfNameId && _.nameId !== this.id).toArray())
        // }
        // } 
    }

    public get abilityType(): string {
        return this.data.type;
    }

    /*public get hotkey(): string {
        switch (this._type) {
            case 'basic':
                return this.data.abilityType;
            case 'heroic':
                return 'R';
            case 'trait':
                return this.isActive === false ? '' : 'D';
            case 'mount':
                return this.isActive === false ? '' : 'Z';
            case 'hearth':
                return 'B';
            case 'spray':
            case 'voice':
                return '';

        }
    }
    */

    public get requiresTalent(): boolean {
        return !!this._abilityTalentId;
    }

    public get requiredTalentId(): string {
        return this._abilityTalentId;
    }

    public get isSubAbility(): boolean {
        return !!this._parentAbilityId;
    }

    public get parentAbilityId(): string {
        return this._parentAbilityId;
    }









}