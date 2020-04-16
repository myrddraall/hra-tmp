import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapControllerComponent } from './map-controller/map-controller.component';
import { MatListModule } from '@angular/material/list';
import { UiAttachmentsModule } from '@ngui/ui-attachments';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MapComponent, MapControllerComponent],
  exports: [MapComponent, MapControllerComponent],
  imports: [
    CommonModule,
    MatListModule,
    UiAttachmentsModule,
    RouterModule
  ]
})
export class MapModule { }
