import { Component } from '@angular/core';
import { IconBaseComponent } from '../../../common/icon/icon-base/icon-base.component';

@Component({
  selector: 'hra-icon-square',
  templateUrl: '../../../common/icon/icon-base/icon-base.component.html',
  styleUrls: ['../../../common/icon/icon-base/icon-base.component.scss']
})
export class IconSquareComponent extends IconBaseComponent {
  public get clipPath(): string {
    return undefined;
  }
}
