import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfernalShrinesComponent } from './infernal-shrines.component';


const routes: Routes = [
  {
    path: '',
    component: InfernalShrinesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../subsections/subsections.module').then(m => m.SubsectionsModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class InfernalShrinesRoutingModule { }
