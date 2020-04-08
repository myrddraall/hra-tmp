import { Component, OnInit, Inject } from '@angular/core';
import { ABILITY_ICON_BASE_PATH } from '../tokens';
import { AbilityButtonComponent } from '../ability-button/ability-button.component';

@Component({
  selector: 'hra-ability-hex-hud-button',
  templateUrl: './ability-hex-hud-button.component.html',
  styleUrls: ['./ability-hex-hud-button.component.scss']
})
export class AbilityHexHudButtonComponent extends AbilityButtonComponent {

  constructor(
    @Inject(ABILITY_ICON_BASE_PATH) basePath: string
  ) {
    super(basePath);
  }

  public get iconUrl(): string {
    return super.iconUrl || 'assets/ui/borders/hud_btn_bg_ability_locked.png';
  }

  public get button(): string {
    switch(this.buttonLabel){
      case null:
        return '';
      case undefined:
        break;
      default:
        return this.buttonLabel;
    }
    
    return this.model?.isActive ? this.model?.hotkey : '';
  }

}
