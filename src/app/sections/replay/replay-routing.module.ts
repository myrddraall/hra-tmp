import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReplayComponent } from './replay.component';
import { ReplayResolver } from 'src/app/resolvers/replay.resolver';


const routes: Routes = [
  {
    path: ':replayId',
    component: ReplayComponent,
    resolve: {
      replay: ReplayResolver
    },
    children: [
      {
        path: 'Infernal Shrines',
        loadChildren: () => import('./maps/infernal-shrines/infernal-shrines.module').then(m => m.InfernalShrinesModule)
      },

      {
        path: ':mapId',
        loadChildren: () => import('./maps/unknown-map/unknown-map.module').then(m => m.UnknownMapModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplayRoutingModule { }
