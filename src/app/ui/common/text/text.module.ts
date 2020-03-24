import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlowingTextComponent } from './glowing-text/glowing-text.component';



@NgModule({
  declarations: [GlowingTextComponent],
  exports: [GlowingTextComponent],
  imports: [
    CommonModule
  ]
})
export class TextModule { }
