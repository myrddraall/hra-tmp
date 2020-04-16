import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApplicationModule } from '@ngui/application';
import { SubsectionsRoutingModule } from './subsections-routing.module';
import { ScoreModule } from './score/score.module';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    ScoreModule,
    SubsectionsRoutingModule,
    ApplicationModule
  ]
})
export class SubsectionsModule { }
