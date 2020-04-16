import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreRoutingModule } from './score/score-routing.module';
import { ScoreModule } from './score/score.module';


const routes: Routes = [];

@NgModule({
  imports: [
    ScoreRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SubsectionsRoutingModule { }
