import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TalentCalculatorComponent } from './talent-calculator.component';
import { HeroListResolver } from 'src/app/resolvers/hero-list.resolver';
import { HeroTalentCalcDescriptionComponent } from './sections/hero-talent-calc-description/hero-talent-calc-description.component';
import { HeroTalentSelectorComponent } from './sections/hero-talent-selector/hero-talent-selector.component';
import { HeroDetailResolver } from 'src/app/resolvers/hero-details-resolver';


const routes: Routes = [
  {
    path: "",
    component: TalentCalculatorComponent,
    resolve: {
      heroList: HeroListResolver
    },
    children: [
      {
        path: "",
        component: HeroTalentCalcDescriptionComponent
      },
      {
        path: ":heroId/:selectedTalents",
        component: HeroTalentSelectorComponent,
        resolve: {
          hero: HeroDetailResolver
        }
      },
      {
        path: ":heroId",
        component: HeroTalentSelectorComponent,
        resolve: {
          hero: HeroDetailResolver
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentCalculatorRoutingModule { }
