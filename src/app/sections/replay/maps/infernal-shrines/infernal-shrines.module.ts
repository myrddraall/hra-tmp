import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfernalShrinesRoutingModule } from './infernal-shrines-routing.module';
import { InfernalShrinesComponent } from './infernal-shrines.component';
import { MapModule } from '../map/map.module';

@NgModule({
  declarations: [InfernalShrinesComponent],
  imports: [
    CommonModule,
    MapModule,
    InfernalShrinesRoutingModule
  ]
})
export class InfernalShrinesModule { }
