import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectDirective } from './file-select.directive';



@NgModule({
  declarations: [
    FileSelectDirective
  ],
  exports: [
    FileSelectDirective
  ],
  imports: [
    CommonModule
  ]
})
export class UploadModule { }
