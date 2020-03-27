import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

function getRedirect():string{
  const baseHref = document.querySelector('head>base').getAttribute('href');
  let redirect = sessionStorage.redirect as string;
  sessionStorage.redirect = '';
  if(redirect){
    redirect = redirect.substr(baseHref.length);
  }else{
    redirect = 'icons';
  }
  return redirect;
}


const routes: Routes = [
  {
    path: "",
    redirectTo: getRedirect(),
    pathMatch: 'full'
  },
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
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
