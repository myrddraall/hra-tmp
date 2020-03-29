import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkCopyButtonComponent } from './link-copy-button/link-copy-button.component';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'

@NgModule({
  declarations: [
    LinkCopyButtonComponent
  ],
  exports: [
    LinkCopyButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class LinksModule { }
