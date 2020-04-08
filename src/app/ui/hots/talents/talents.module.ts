import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentSquareButtonComponent } from './talent-square-button/talent-square-button.component';
import { ImageModule } from '../../common/image/image.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconsModule } from '../icons/icons.module';
import { TalentTooltipComponent } from './talent-tooltip/talent-tooltip.component';
import { TextModule } from '../../common/text/text.module';
import { TalentDetailButtonComponent } from './talent-detail-button/talent-detail-button.component';
import { TalentBuildLinkCopyButtonComponent } from './talent-build-link-copy-button/talent-build-link-copy-button.component';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    TalentSquareButtonComponent,
    TalentTooltipComponent,
    TalentDetailButtonComponent,
    TalentBuildLinkCopyButtonComponent
  ],
  exports: [
    TalentSquareButtonComponent,
    TalentTooltipComponent,
    TalentDetailButtonComponent,
    TalentBuildLinkCopyButtonComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule,
    TextModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TalentsModule { }
