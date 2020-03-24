import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSquareButtonComponent } from './hero-square-button/hero-square-button.component';
import { ImageModule } from '../../common/image/image.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconsModule } from '../icons/icons.module';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ContainersModule } from '../../common/containers/containers.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    HeroSquareButtonComponent,
    HeroSearchComponent
  ],
  exports: [
    HeroSquareButtonComponent,
    HeroSearchComponent
  ],
  imports: [
    CommonModule,
    ImageModule,
    ButtonsModule,
    IconsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ContainersModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HeroesModule { }
