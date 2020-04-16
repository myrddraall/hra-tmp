import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadModule } from 'src/app/ui/common/upload/upload.module';
import { ReplayUploadButtonComponent } from './replay-upload-button/replay-upload-button.component';

import { MatButtonModule } from '@angular/material/button'
import { ApplicationModule } from '@ngui/application';

@NgModule({
  declarations: [
    ReplayUploadButtonComponent
  ],
  exports: [
    ReplayUploadButtonComponent
  ],
  imports: [
    CommonModule,
    UploadModule,
    MatButtonModule,
    ApplicationModule
  ]
})
export class ReplayUploadModule { }
