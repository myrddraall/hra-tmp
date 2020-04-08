import { Input } from '@angular/core';
import { AbilityDefinitionModel, TalentDefinitionModel } from 'hots-gamedata';
import { HeroicButtonBaseComponent } from '../heroic-button-base/heroic-button-base.component';

export abstract class AbilityTalentButtonBaseComponent<T> extends HeroicButtonBaseComponent {


  @Input()
  public model: AbilityDefinitionModel | TalentDefinitionModel;

  public get iconUrl():string{
    return !this.model ? '' : `${this.basePath}/${this.model.icon}`;
  }

}
