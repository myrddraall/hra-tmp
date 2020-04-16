import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreScreenComponent } from './score-screen/score-screen.component';
import { TalentsComponent } from './talents/talents.component';
import { ScoreScreenResolver } from './score-screen/score-screen-resolver';
import { TalentsResolver } from './talents/talents-resolver';


const routes: Routes = [
  {
    path: 'talents',
    component: TalentsComponent,
    resolve: {
      talents: TalentsResolver
    }
  },
 {
    path: '',
    component: ScoreScreenComponent,
    resolve: {
      scores: ScoreScreenResolver
    },
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreRoutingModule { }
