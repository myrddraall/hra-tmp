import { Component, OnInit, Input } from '@angular/core';
import { IAbility, ITalent, HeroModel } from 'hots-gamedata';
import { HeroicButtonBaseComponent } from '../heroic-button-base/heroic-button-base.component';

export abstract class AbilityTalentButtonBaseComponent<T> extends HeroicButtonBaseComponent {


  @Input()
  public model: IAbility | ITalent;

  public get iconUrl():string{
    return !this.model ? '' : `${this.basePath}/${this.model.icon}`;
  }

}
