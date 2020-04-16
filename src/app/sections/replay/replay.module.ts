import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiAttachmentsModule } from '@ngui/ui-attachments';
import { IconsModule } from 'src/app/components/icons/icons.module';
import { MapModule } from 'src/app/components/map/map.module';
import { MatchinfoBarComponent } from './matchinfo-bar/matchinfo-bar.component';
import { ReplayRoutingModule } from './replay-routing.module';
import { ReplayComponent } from './replay.component';


@NgModule({
  declarations: [ReplayComponent, MatchinfoBarComponent],
  imports: [
    CommonModule,
    ReplayRoutingModule,
    MapModule,
    IconsModule,
    UiAttachmentsModule
  ]
})
export class ReplayModule { }

