import { Component, Inject } from '@angular/core';
import { TalentButtonComponent } from '../talent-button/talent-button.component';
import { TALENT_ICON_BASE_PATH } from '../tokens';

@Component({
  selector: 'hra-talent-square-button',
  templateUrl: './talent-square-button.component.html',
  styleUrls: ['./talent-square-button.component.scss']
})
export class TalentSquareButtonComponent extends TalentButtonComponent {

  constructor(
    @Inject(TALENT_ICON_BASE_PATH) basePath: string
  ) {
    super(basePath);
  }
}
