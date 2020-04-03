import { Component, Input, HostBinding } from '@angular/core';
import { IconBaseComponent } from '../../../common/icon/icon-base/icon-base.component';

@Component({
  selector: 'hra-icon-chevron',
  templateUrl: '../../../common/icon/icon-base/icon-base.component.html',
  styleUrls: ['../../../common/icon/icon-base/icon-base.component.scss', './icon-chevron.component.scss']
})
export class IconChevronComponent extends IconBaseComponent{
  
  @HostBinding('attr.direction')
  @Input()
  public direction: 'left' | 'right' = 'left';

  public get clipPath(): string {
    return this.direction === 'right' ? 'M 0%,0% 66%,0% 100%,100% 33%,100% z' : 'M 33%,0% 100%,0% 66%,100% 0%,100% z';
  }
}
