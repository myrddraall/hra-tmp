import { Component, Inject } from '@angular/core';
import { HeroButtonComponent } from '../hero-button/hero-button.component';
import { HERO_ICON_BASE_PATH } from '../tokens';

@Component({
  selector: 'hra-hero-square-button',
  templateUrl: './hero-square-button.component.html',
  styleUrls: ['./hero-square-button.component.scss']
})
export class HeroSquareButtonComponent extends HeroButtonComponent {

  constructor(
    @Inject(HERO_ICON_BASE_PATH) basePath: string
  ) { 
    super(basePath);
  }
/*
  public get iconUrl():string{
    return super.iconUrl || 'assets/ui/borders/hud_btn_bg_ability_locked.png';
  }
  */

}
