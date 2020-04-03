import { Component, OnInit, Inject, HostBinding, Input } from '@angular/core';
import { ABILITY_ICON_BASE_PATH } from '../tokens';
import { AbilityButtonComponent } from '../ability-button/ability-button.component';

@Component({
  selector: 'hra-ability-chevron-hud-button',
  templateUrl: './ability-chevron-hud-button.component.html',
  styleUrls: ['./ability-chevron-hud-button.component.scss']
})
export class AbilityChevronHudButtonComponent extends AbilityButtonComponent {

  @HostBinding('attr.direction')
  @Input()
  public direction: 'left' | 'right' = 'left';
  
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
    
    switch (this.model?.button) {
      case 'Heroic':
        return 'R';
      case 'Trait':
        return 'D';
        case 'Active':
          return '#';
      default:
        return this.model?.button;
    }
  }

}
