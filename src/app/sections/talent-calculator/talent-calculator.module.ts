import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeroesModule } from 'src/app/ui/hots/heroes/heroes.module';
import { PortraitsModule } from '../../components/portraits/portraits.module';
import { TalentsModule } from '../../ui/hots/talents/talents.module';
import { HeroTalentCalcDescriptionComponent } from './sections/hero-talent-calc-description/hero-talent-calc-description.component';
import { HeroTalentSelectorComponent } from './sections/hero-talent-selector/hero-talent-selector.component';
import { TalentCalculatorRoutingModule } from './talent-calculator-routing.module';
import { TalentCalculatorComponent } from './talent-calculator.component';
import { ContainersModule } from 'src/app/ui/common/containers/containers.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BuildSearchComponent } from './build-search/build-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LinksModule } from 'src/app/ui/common/links/links.module';
@NgModule({
  declarations: [TalentCalculatorComponent, HeroTalentSelectorComponent, HeroTalentCalcDescriptionComponent, BuildSearchComponent],
  imports: [
    CommonModule,
    PortraitsModule,
    MatSliderModule,
    ContainersModule,
    TalentsModule,
    HeroesModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    LinksModule,
    TalentCalculatorRoutingModule,
    MatSidenavModule
  ]
})
export class TalentCalculatorModule { }
