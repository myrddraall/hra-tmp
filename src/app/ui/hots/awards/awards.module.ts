import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAwardIconComponent } from './match-award-icon/match-award-icon.component';
import { IconsModule } from '../icons/icons.module';
import { TooltipsModule } from '../../common/tooltip/tooltip.module';
import { TextModule } from '../../common/text/text.module';



@NgModule({
  declarations: [MatchAwardIconComponent],
  exports: [MatchAwardIconComponent],
  imports: [
    CommonModule,
    IconsModule,
    TooltipsModule,
    TextModule
  ]
})
export class AwardsModule { }
