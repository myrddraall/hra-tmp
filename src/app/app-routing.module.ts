import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'match',
    loadChildren: () => import('./sections/replay/replay.module').then(m => m.ReplayModule)
  },
  {
    path: 'talent-calculator',
    loadChildren: () => import('./sections/talent-calculator/talent-calculator.module').then(m => m.TalentCalculatorModule)
  },
  {
    path: 'icons',
    loadChildren: () => import('./sections/icon-test/icon-test.module').then(m => m.IconTestModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
