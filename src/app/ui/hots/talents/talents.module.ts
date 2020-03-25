import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentSquareButtonComponent } from './talent-square-button/talent-square-button.component';
import { ImageModule } from '../../common/image/image.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconsModule } from '../icons/icons.module';
import { TalentTooltipComponent } from './talent-tooltip/talent-tooltip.component';
import { TextModule } from '../../common/text/text.module';
import { TalentDetailButtonComponent } from './talent-detail-button/talent-detail-button.component';



@NgModule({
  declarations: [
    TalentSquareButtonComponent,
    TalentTooltipComponent,
    TalentDetailButtonComponent
  ],
  exports: [
    TalentSquareButtonComponent,
    TalentTooltipComponent,
    TalentDetailButtonComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule,
    TextModule
  ]
})
export class TalentsModule { }
