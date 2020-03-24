import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReplayComponent } from './replay.component';


const routes: Routes = [
  {
    path: ':replayId',
    component: ReplayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplayRoutingModule { }
