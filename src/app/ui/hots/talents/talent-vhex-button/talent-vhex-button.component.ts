import { Component, Inject } from '@angular/core';
import { TalentButtonComponent } from '../talent-button/talent-button.component';
import { TALENT_ICON_BASE_PATH } from '../tokens';

@Component({
  selector: 'hra-talent-vhex-button',
  templateUrl: './talent-vhex-button.component.html',
  styleUrls: ['./talent-vhex-button.component.scss']
})
export class TalentVHexButtonComponent extends TalentButtonComponent {

  constructor(
    @Inject(TALENT_ICON_BASE_PATH) basePath: string
  ) {
    super(basePath);
  }
}
