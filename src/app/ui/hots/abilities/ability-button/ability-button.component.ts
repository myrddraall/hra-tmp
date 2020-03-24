import { Component, OnInit, Input } from '@angular/core';
import { IAbility, ITalent, HeroModel } from 'hots-gamedata';
import { AbilityTalentButtonBaseComponent } from '../../buttons/ability-talent-button-base/ability-talent-button-base.component';

export abstract class AbilityButtonComponent extends AbilityTalentButtonBaseComponent<IAbility> {
    @Input()
    private ___a;
}
