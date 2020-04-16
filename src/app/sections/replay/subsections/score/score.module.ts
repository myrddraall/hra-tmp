import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ScoreScreenComponent } from './score-screen/score-screen.component';
import { ApplicationModule } from '@ngui/application';
import { TalentsComponent } from './talents/talents.component';
import { DataTablesModule } from 'src/app/ui/hots/data-tables/data-tables.module';


@NgModule({
  declarations: [ScoreScreenComponent, TalentsComponent],
  imports: [
    CommonModule,
    ScoreRoutingModule,
    ApplicationModule,
    DataTablesModule
  ]
})
export class ScoreModule { }
