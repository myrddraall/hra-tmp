import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplayRoutingModule } from './replay-routing.module';
import { ReplayComponent } from './replay.component';
import { MapModule } from 'src/app/components/map/map.module';
import { IconsModule } from 'src/app/components/icons/icons.module';
import { MatchinfoBarComponent } from './matchinfo-bar/matchinfo-bar.component';


@NgModule({
  declarations: [ReplayComponent, MatchinfoBarComponent],
  imports: [
    CommonModule,
    ReplayRoutingModule,
    MapModule,
    IconsModule
  ]
})
export class ReplayModule { }

