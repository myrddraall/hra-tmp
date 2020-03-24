import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { IAbility, ITalent } from 'hots-gamedata';


function isTalent(obj: IAbility | ITalent): obj is ITalent {
  return obj?.type === 'talent';
}

@Component({
  selector: 'hra-ability-type-icon',
  templateUrl: './ability-type-icon.component.html',
  styleUrls: ['./ability-type-icon.component.scss']
})
export class AbilityTypeIconComponent implements OnInit {
  @Input()
  public ability: IAbility | ITalent;

  constructor() { }

  ngOnInit(): void {
  }

  public get label(): string {
    switch (this.ability?.button?.toLowerCase()) {
      case '#':
        return 'Active';
      case 't':
      case 'd':
      case 'trait':
        return 'Trait' + (this.isActive  ? ' (D)' : '');
      case 'h':
      case 'r':
      case 'heroic':
        return 'Heroic' + (this.isActive  ? ' (R)' : '');
      case null:
      case undefined:
        return 'Passive';
      default:
        return this.ability?.button;
    }
  }

  @HostBinding('class.quest')
  public get isQuest(): boolean {
    return !!this.ability?.isQuest;
  }

  @HostBinding('class.active')
  public get isActive(): boolean {
    return !!this.ability?.isActive;
  }

  @HostBinding('class.passive')
  public get isPassive(): boolean {
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
    switch (this.ability?.button?.toLowerCase()) {
      case 'heroic':
      case 'r':
        return true;
    }
    return false;
  }

  @HostBinding('class.heroic-upgrade')
  public get isHeroicUpgrade(): boolean {
    return isTalent(this.ability) && this.isHeroic && !!this.ability.prerequisiteTalentIds?.length;
  }

  public get type(): string {
    switch (this.ability?.button) {
      case '#':
        return 'active';
      case 'Heroic':
        return 'Her';
      case '':
      case null:
      case undefined:
        return 'passive';
      default:
        return this.ability?.button;
    }
  }

}
