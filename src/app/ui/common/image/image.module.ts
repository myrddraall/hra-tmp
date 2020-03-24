import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapedImageDirective } from './shaped-image/shaped-image.directive';


@NgModule({
  declarations: [ShapedImageDirective],
  exports: [ShapedImageDirective],
  imports: [
    CommonModule
  ]
})
export class ImageModule { }

