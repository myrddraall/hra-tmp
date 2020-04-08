import { Input, ViewChild, AfterViewInit } from '@angular/core';
import { HeroModel2 } from 'hots-gamedata';
import { TooltipDirective } from 'src/app/ui/common/tooltip/tooltip.directive';

export abstract class HeroicButtonBaseComponent implements AfterViewInit {

  @ViewChild('tooltip')
  private _tooltip:TooltipDirective;
  
  @Input()
  public hero: HeroModel2;

  @Input()
  public tooltip: boolean;

  constructor(
    protected readonly basePath: string
  ) { }

  ngAfterViewInit(): void {
    
  }

  public abstract get iconUrl(): string;

}
