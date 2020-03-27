import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'hra-tooltip-panel',
  templateUrl: './tooltip-panel.component.html',
  styleUrls: ['./tooltip-panel.component.scss']
})
export class TooltipPanelComponent implements OnInit {

  private _content:TemplatePortal;
  public get content():TemplatePortal{
    return this._content;
  }

  public set content(value:TemplatePortal){
    this._content = value;
    this.changeRef.markForCheck();
  }
  
  constructor(
    private readonly changeRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

}
