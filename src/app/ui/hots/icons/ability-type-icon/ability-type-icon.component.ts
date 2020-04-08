import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { IAbility, ITalent, AbilityDefinitionModel, TalentDefinitionModel, AbilityType } from 'hots-gamedata';


function isTalent(obj: AbilityDefinitionModel | TalentDefinitionModel): obj is TalentDefinitionModel {
  return obj instanceof TalentDefinitionModel;
}

@Component({
  selector: 'hra-ability-type-icon',
  templateUrl: './ability-type-icon.component.html',
  styleUrls: ['./ability-type-icon.component.scss']
})
export class AbilityTypeIconComponent implements OnInit {
  @Input()
  public ability: AbilityDefinitionModel | TalentDefinitionModel;

  constructor() { }

  ngOnInit(): void {
  }

  public get label(): string {
    const ability = this.ability;

    switch (ability.abilityButton) {

      case AbilityType.Trait:
        return 'Trait' + (ability.isActive ? ' (D)' : '');
      case AbilityType.Heroic:
        return 'Heroic' + (ability.isActive ? ' (R)' : '');
      case AbilityType.Passive:
        return 'Passive';

      default:
        return this.ability.abilityButton;

    }
    /*
        if (ability instanceof AbilityDefinitionModel) {
    
          switch (ability.abilityType) {
            case 'activable':
              return 'Active';
            case 'trait':
              return 'Trait' + (ability.isActive ? ' (D)' : '');
            case 'heroic':
              return 'Heroic' + (ability.isActive ? ' (R)' : '');
            case 'basic':
              return ability.hotkey;
            case 'mount':
              return 'Z';
            case 'hearth':
              return 'B';
            case null:
            case undefined:
              return 'Passive';
            default:
              return '';
          }
        } else {
    
          switch (ability.hotkey) {
            case '#':
              return 'Active';
            case 'R':
              return 'Heroic' + (ability.isActive ? ' (R)' : '');
            case 'Q':
            case 'W':
            case 'E':
              return ability.hotkey;
            case '':
              return 'Passive';
    
          }
        }*/
  }

  @HostBinding('class.quest')
  public get isQuest(): boolean {
    if (this.ability instanceof TalentDefinitionModel) {
      return !!this.ability?.isQuest;
    }
    return false;
  }

  @HostBinding('class.active')
  public get isActive(): boolean {
    if (isTalent(this.ability)) {
      switch (this.ability.abilityButton) {
        case AbilityType.Heroic:
          return false;
        default:
          return !!this.ability?.isActive;
      }
    }
    return !!this.ability?.isActive;
    
  }

  @HostBinding('class.passive')
  public get isPassive(): boolean {
    if (isTalent(this.ability)) {
      switch (this.ability.abilityButton) {
        case AbilityType.Heroic:
          return this.ability.prerequisiteTalentIds?.length ? false : true;
        default:
          return !!this.ability?.isActive;
      }
    }
    /*switch (this.type) {
      case 'Active':
      case 'Q':
      case 'W':
      case 'E':
        return false;
      case 'Heroic':
        return isTalent(this.ability) ? (this.ability.prerequisiteTalentIds?.length ? false : true) : this.ability.isPassive;
    }*/
    return !!this.ability?.isPassive;
  }

  @HostBinding('class.talent')
  public get isTalent(): boolean {
    return isTalent(this.ability);
  }
  @HostBinding('class.ability')
  public get isAbility(): boolean {
    return !isTalent(this.ability);
  }

  @HostBinding('class.heroic')
  public get isHeroic(): boolean {
    switch (this.ability?.hotkey) {
      case 'R':
        return true;
    }
    return false;
  }

  @HostBinding('class.heroic-upgrade')
  public get isHeroicUpgrade(): boolean {
    return isTalent(this.ability) && this.isHeroic && !!this.ability.prerequisiteTalentIds?.length;
  }



}
