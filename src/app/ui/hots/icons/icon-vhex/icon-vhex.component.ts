import { Component } from '@angular/core';
import { IconBaseComponent } from '../../../common/icon/icon-base/icon-base.component';

@Component({
  selector: 'hra-icon-vhex',
  templateUrl: '../../../common/icon/icon-base/icon-base.component.html',
  styleUrls: ['../../../common/icon/icon-base/icon-base.component.scss']
})
export class IconVHexComponent extends IconBaseComponent{
  
  public get clipPath(): string {
    return 'M 50%,0% 92.5%,24% 92.5%,75% 50%,100% 7%,75% 7%,24% z';
  }

 

}
