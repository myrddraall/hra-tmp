import { Component, Inject } from '@angular/core';
import { TalentButtonComponent } from '../talent-button/talent-button.component';
import { TALENT_ICON_BASE_PATH } from '../tokens';


@Component({
  selector: 'hra-talent-detail-button',
  templateUrl: './talent-detail-button.component.html',
  styleUrls: ['./talent-detail-button.component.scss']
})
export class TalentDetailButtonComponent extends TalentButtonComponent {

  constructor(
    @Inject(TALENT_ICON_BASE_PATH) basePath: string
  ) {
    super(basePath);
  }
}
