import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'hra-extended-role-filter-button',
  templateUrl: './extended-role-filter-button.component.html',
  styleUrls: ['./extended-role-filter-button.component.scss']
})
export class ExtendedRoleFilterButtonComponent {

  @Input()
  @HostBinding('attr.role')
  public role:string;

}
