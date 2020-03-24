import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconVHexComponent } from './icon-vhex/icon-vhex.component';
import { IconCircleComponent } from './icon-circle/icon-circle.component';
import { IconSquareComponent } from './icon-square/icon-square.component';
import { ImageModule } from '../../common/image/image.module';



@NgModule({
  declarations: [
    IconCircleComponent,
    IconSquareComponent,
    IconVHexComponent
  ],
  exports: [
    IconCircleComponent,
    IconSquareComponent,
    IconVHexComponent
  ],
  imports: [
    CommonModule,
    ImageModule
  ]
})
export class IconsModule { }
