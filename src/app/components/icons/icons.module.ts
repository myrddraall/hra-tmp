import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextModule } from '../../ui/common/text/text.module';
import { TooltipsModule } from '../../ui/common/tooltip/tooltip.module';
import { AbilityTypeIconComponent } from './ability-type-icon/ability-type-icon.component';
import { BorderedIconComponent } from './bordered-icon/bordered-icon.component';
import { TalentComponent } from './talent/talent.component';



@NgModule({
  declarations: [BorderedIconComponent, TalentComponent, AbilityTypeIconComponent],
  exports: [BorderedIconComponent, TalentComponent],
  imports: [
    CommonModule,
    TooltipsModule,
    TextModule
  ]
})
export class IconsModule { }
