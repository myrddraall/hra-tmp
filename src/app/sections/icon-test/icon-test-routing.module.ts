import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShapedImageComponent } from './shaped-image/shaped-image.component';

const routes: Routes = [
  {
    path: '',
    component: ShapedImageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconTestRoutingModule { }
