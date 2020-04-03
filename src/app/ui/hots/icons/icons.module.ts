import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconVHexComponent } from './icon-vhex/icon-vhex.component';
import { IconCircleComponent } from './icon-circle/icon-circle.component';
import { IconSquareComponent } from './icon-square/icon-square.component';
import { ImageModule } from '../../common/image/image.module';
import { AbilityTypeIconComponent } from './ability-type-icon/ability-type-icon.component';
import { IconChevronComponent } from './icon-chevron/icon-chevron.component';



@NgModule({
  declarations: [
    IconCircleComponent,
    IconSquareComponent,
    IconVHexComponent,
    IconChevronComponent,
    AbilityTypeIconComponent
  ],
  exports: [
    IconCircleComponent,
    IconSquareComponent,
    IconVHexComponent,
    IconChevronComponent,
    AbilityTypeIconComponent
  ],
  imports: [
    CommonModule,
    ImageModule
  ]
})
export class IconsModule { }
