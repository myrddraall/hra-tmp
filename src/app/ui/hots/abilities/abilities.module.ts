import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { AbilityHexHudButtonComponent } from './ability-hex-hud-button/ability-hex-hud-button.component';
import { ButtonsModule } from '../buttons/buttons.module';
import { ImageModule } from '../../common/image/image.module';
import { IconsModule } from '../icons/icons.module';



@NgModule({
  declarations: [
    AbilityHexHudButtonComponent
  ],
  exports: [
    AbilityHexHudButtonComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule
  ]
})
export class AbilitiesModule { }
