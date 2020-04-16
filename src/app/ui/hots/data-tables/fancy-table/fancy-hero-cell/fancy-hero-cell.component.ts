import { Component, OnInit, Inject, Input } from '@angular/core';
import { HERO_ICON_BASE_PATH } from '../../../heroes/tokens';
import { HeroModel2 } from 'hots-gamedata';
import { Player } from 'replay-processor';

@Component({
  selector: 'hra-fancy-hero-cell',
  templateUrl: './fancy-hero-cell.component.html',
  styleUrls: [
    '../fancy-cell/fancy-cell.component.scss',
    './fancy-hero-cell.component.scss',
  ]
})
export class FancyHeroCellComponent implements OnInit {

  @Input()
  public hero:HeroModel2;

  @Input()
  public player:Player;
  
  constructor(
    @Inject(HERO_ICON_BASE_PATH) private readonly basePath:string
  ) { }

  ngOnInit(): void {
  }

  public get heroIcon():string{
    if(this.hero){
      return `${this.basePath}/${this.hero.portraits.partyPanel}`;
    }
    return '';
  }

}
