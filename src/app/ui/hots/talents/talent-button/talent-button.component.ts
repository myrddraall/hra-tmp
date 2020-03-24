import { ITalent } from 'hots-gamedata';
import { AbilityTalentButtonBaseComponent } from '../../buttons/ability-talent-button-base/ability-talent-button-base.component';
import { Input } from '@angular/core';

export abstract class TalentButtonComponent extends AbilityTalentButtonBaseComponent<ITalent> {
    @Input()
    private ___a;
}
