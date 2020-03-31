import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsableComponent } from './collapsable/collapsable.component';
import { ApplicationFrameComponent } from './application-frame/application-frame.component';



@NgModule({
  declarations: [CollapsableComponent, ApplicationFrameComponent],
  exports: [CollapsableComponent, ApplicationFrameComponent],
  imports: [
    CommonModule
  ]
})
export class ContainersModule { }
