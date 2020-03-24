import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsableComponent } from './collapsable/collapsable.component';



@NgModule({
  declarations: [CollapsableComponent],
  exports: [CollapsableComponent],
  imports: [
    CommonModule
  ]
})
export class ContainersModule { }
