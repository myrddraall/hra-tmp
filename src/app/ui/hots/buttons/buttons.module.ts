import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareButtonBorderComponent } from './borders/square-button-border/square-button-border.component';
import { HexButtonBorderComponent } from './borders/hex-button-border/hex-button-border.component';
import { CircleButtonBorderComponent } from './borders/circle-button-border/circle-button-border.component';
import { BaseButtonBorderComponent } from './borders/base-button-border/base-button-border.component';
import { TooltipsModule } from '../../common/tooltip/tooltip.module';
import { ChevronButtonBorderComponent } from './borders/cheveron-button-border/cheveron-button-border.component';



@NgModule({
  declarations: [
    SquareButtonBorderComponent,
    HexButtonBorderComponent,
    CircleButtonBorderComponent,
    BaseButtonBorderComponent,
    ChevronButtonBorderComponent
  ],
  exports: [
    SquareButtonBorderComponent,
    HexButtonBorderComponent,
    CircleButtonBorderComponent,
    BaseButtonBorderComponent,
    TooltipsModule,
    ChevronButtonBorderComponent
  ],
  imports: [
    CommonModule,
    TooltipsModule
  ]
})
export class ButtonsModule { }
