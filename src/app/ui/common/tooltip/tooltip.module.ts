import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { TooltipPanelComponent } from './tooltip-panel/tooltip-panel.component';
import { TooltipTextDirective } from './tooltip-text.directive'


@NgModule({
  declarations: [TooltipDirective, TooltipPanelComponent, TooltipTextDirective],
  exports: [TooltipDirective, TooltipPanelComponent, TooltipTextDirective],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule
  ]
})
export class TooltipsModule { }
