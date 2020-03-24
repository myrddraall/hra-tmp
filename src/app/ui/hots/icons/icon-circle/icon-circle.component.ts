import { Component } from '@angular/core';
import { IconBaseComponent } from '../../../common/icon/icon-base/icon-base.component';

@Component({
  selector: 'hra-icon-circle',
  templateUrl: '../../../common/icon/icon-base/icon-base.component.html',
  styleUrls: [
    '../../../common/icon/icon-base/icon-base.component.scss',
    './icon-circle.component.scss'
  ]
})
export class IconCircleComponent extends IconBaseComponent {

  public get clipPath(): string {
    return undefined;
  }

}
