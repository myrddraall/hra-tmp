import { Input, ViewChild, AfterViewInit } from '@angular/core';
import { HeroModel } from 'hots-gamedata';
import { TooltipDirective } from 'src/app/ui/common/tooltip/tooltip.directive';

export abstract class HeroicButtonBaseComponent implements AfterViewInit {

  @ViewChild('tooltip')
  private _tooltip:TooltipDirective;
  
  @Input()
  public hero: HeroModel;

  @Input()
  public tooltip: boolean;

  constructor(
    protected readonly basePath: string
  ) { }

  ngAfterViewInit(): void {
    
  }

  public abstract get iconUrl(): string;

}
