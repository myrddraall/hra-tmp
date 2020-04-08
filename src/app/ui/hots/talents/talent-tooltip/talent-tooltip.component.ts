import { Component, Input, OnInit } from '@angular/core';
import { HeroModel2, ITalent } from 'hots-gamedata';

@Component({
  selector: 'hra-talent-tooltip',
  templateUrl: './talent-tooltip.component.html',
  styleUrls: ['./talent-tooltip.component.scss']
})
export class TalentTooltipComponent implements OnInit {

  @Input()
  public talent: ITalent;
  @Input()
  public hero: HeroModel2;

  constructor() { }

  ngOnInit(): void {
  }

}
