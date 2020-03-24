import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { IBasicHeroModel } from 'hots-gamedata';

@Component({
  selector: 'small-square-hero-portrait',
  templateUrl: './small-square-hero-portrait.component.html',
  styleUrls: ['./small-square-hero-portrait.component.scss']
})
export class SmallSquareHeroPortraitComponent implements OnInit {

  @HostBinding('attr.selected')
  private _selectedAttr:string;

  @Input()
  private hero: IBasicHeroModel;

  @Input()
  public get selected(): boolean{
    return this._selectedAttr === '';
  }

  public set selected(value: boolean){
     this._selectedAttr = value ? '' : undefined;
  }
  constructor() { }

  ngOnInit(): void {
  }

  public get iconUrl(): string {
    return `https://raw.githubusercontent.com/HeroesToolChest/heroes-images/master/heroesimages/heroportraits/${this.hero?.portraits.target}`;
  }
}
