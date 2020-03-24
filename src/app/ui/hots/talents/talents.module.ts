import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentSquareButtonComponent } from './talent-square-button/talent-square-button.component';
import { ImageModule } from '../../common/image/image.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconsModule } from '../icons/icons.module';
import { TalentTooltipComponent } from './talent-tooltip/talent-tooltip.component';



@NgModule({
  declarations: [
    TalentSquareButtonComponent,
    TalentTooltipComponent
  ],
  exports: [
    TalentSquareButtonComponent,
    TalentTooltipComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule
  ]
})
export class TalentsModule { }
