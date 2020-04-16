import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnknownMapComponent } from './unknown-map.component';


const routes: Routes = [
  {
    path: '',
    component: UnknownMapComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../subsections/subsections.module').then(m => m.SubsectionsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnknownMapRoutingModule { }
