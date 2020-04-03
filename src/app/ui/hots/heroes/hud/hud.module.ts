import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeroHudUnitComponent } from './hero-hud-unit/hero-hud-unit.component';

import { HeroHudAbilitiesComponent } from './hero-hud-abilities/hero-hud-abilities.component';
import { TextModule } from '../../../common/text/text.module';
import { IconsModule } from '../../icons/icons.module';
import { TooltipsModule } from '../../../common/tooltip/tooltip.module';
import { ImageModule } from '../../../common/image/image.module';
import { AbilitiesModule } from '../../abilities/abilities.module';
import {MatSliderModule} from '@angular/material/slider'
import { ApplicationModule } from '@ngui/application';


@NgModule({
  declarations: [HeroHudUnitComponent, HeroHudAbilitiesComponent],
  exports: [HeroHudUnitComponent, HeroHudAbilitiesComponent],
  imports: [
    CommonModule,
    IconsModule,
    ApplicationModule,
    TooltipsModule,
    TextModule,
    ImageModule,
    AbilitiesModule,
    MatSliderModule
  ]
})
export class HudModule { }
