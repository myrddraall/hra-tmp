import { Input } from '@angular/core';
import { IAbility } from 'hots-gamedata';
import { AbilityTalentButtonBaseComponent } from '../../buttons/ability-talent-button-base/ability-talent-button-base.component';

export abstract class AbilityButtonComponent extends AbilityTalentButtonBaseComponent<IAbility> {
    @Input()
    public buttonLabel:string = undefined;
}
