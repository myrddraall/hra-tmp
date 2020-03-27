import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { AbilityHexHudButtonComponent } from './ability-hex-hud-button/ability-hex-hud-button.component';
import { ButtonsModule } from '../buttons/buttons.module';
import { ImageModule } from '../../common/image/image.module';
import { IconsModule } from '../icons/icons.module';
import { AbilityTooltipComponent } from './ability-tooltip/ability-tooltip.component';
import { TextModule } from '../../common/text/text.module';
import { TooltipsModule } from '../../common/tooltip/tooltip.module';



@NgModule({
  declarations: [
    AbilityHexHudButtonComponent,
    AbilityTooltipComponent
  ],
  exports: [
    AbilityHexHudButtonComponent,
    AbilityTooltipComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule,
    TextModule,
    TooltipsModule
  ]
})
export class AbilitiesModule { }
