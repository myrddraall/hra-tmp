import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'hra-franchise-filter-button',
  templateUrl: './franchise-filter-button.component.html',
  styleUrls: ['./franchise-filter-button.component.scss']
})
export class FranchiseFilterButtonComponent {

  @Input()
  @HostBinding('attr.franchise')
  public franchise:string;

}
