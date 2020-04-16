import { Component } from '@angular/core';
import { IconBaseComponent } from '../../../common/icon/icon-base/icon-base.component';

@Component({
  selector: 'hra-icon',
  templateUrl: '../../../common/icon/icon-base/icon-base.component.html',
  styleUrls: [
    '../../../common/icon/icon-base/icon-base.component.scss',
    './icon.component.scss'
  ]
})
export class IconComponent extends IconBaseComponent {
  public get clipPath(): string {
    return undefined;
  }
}
