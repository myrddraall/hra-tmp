import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmallSquareHeroPortraitComponent } from './small-square-hero-portrait/small-square-hero-portrait.component';
import { IconsModule } from '../icons/icons.module';



@NgModule({
  declarations: [
    SmallSquareHeroPortraitComponent
  ],
  imports: [
    CommonModule,
    IconsModule
  ],
  exports:[
    SmallSquareHeroPortraitComponent
  ]
})
export class PortraitsModule { }
