import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnknownMapRoutingModule } from './unknown-map-routing.module';
import { UnknownMapComponent } from './unknown-map.component';
import { MapModule } from '../map/map.module';


@NgModule({
  declarations: [UnknownMapComponent],
  imports: [
    CommonModule,
    MapModule,
    UnknownMapRoutingModule
  ]
})
export class UnknownMapModule { }
