import { Component, OnInit } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'hra-tooltip-panel',
  templateUrl: './tooltip-panel.component.html',
  styleUrls: ['./tooltip-panel.component.scss']
})
export class TooltipPanelComponent implements OnInit {

  public content:TemplatePortal;
  
  constructor() { }

  ngOnInit(): void {
  }

}
