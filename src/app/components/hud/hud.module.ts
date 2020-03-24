import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconsModule } from '../icons';
import { TooltipsModule } from '../../ui/common/tooltip/tooltip.module';
import { HeroHudUnitComponent } from './hero-hud-unit/hero-hud-unit.component';

import { HeroHudAbilitiesComponent } from './hero-hud-abilities/hero-hud-abilities.component';
import { TextModule } from 'src/app/ui/common/text/text.module';
import { ContainersModule } from 'src/app/ui/common/containers/containers.module';



@NgModule({
  declarations: [HeroHudUnitComponent, HeroHudAbilitiesComponent],
  exports: [HeroHudUnitComponent, HeroHudAbilitiesComponent],
  imports: [
    CommonModule,
    IconsModule,
    ContainersModule,
    TooltipsModule,
    TextModule,
    IconsModule
  ]
})
export class HudModule { }
