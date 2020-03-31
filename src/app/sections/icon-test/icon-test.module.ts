import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTestRoutingModule } from './icon-test-routing.module';
import { ShapedImageComponent } from './shaped-image/shaped-image.component';

import { ImageModule } from '../../ui/common/image/image.module';
import { AbilitiesModule } from '../../ui/hots/abilities/abilities.module';
import { ButtonsModule } from '../../ui/hots/buttons/buttons.module';
import { IconsModule } from '../../ui/hots/icons/icons.module';
import { TalentsModule } from '../../ui/hots/talents/talents.module';

import {ApplicationModule} from '@ngui/application';

@NgModule({
  declarations: [ShapedImageComponent],
  imports: [
    CommonModule,
    IconTestRoutingModule,
    ImageModule,
    AbilitiesModule,
    ButtonsModule,
    IconsModule,
    TalentsModule,
    ApplicationModule
  ]
})
export class IconTestModule { }
