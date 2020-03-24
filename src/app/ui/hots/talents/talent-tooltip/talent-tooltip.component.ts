import { Component, OnInit, Input } from '@angular/core';
import { ITalent, HeroModel } from 'hots-gamedata';

@Component({
  selector: 'hra-talent-tooltip',
  templateUrl: './talent-tooltip.component.html',
  styleUrls: ['./talent-tooltip.component.scss']
})
export class TalentTooltipComponent implements OnInit {

  @Input()
  public talent: ITalent;
  @Input()
  public hero: HeroModel;

  constructor() { }

  ngOnInit(): void {
  }

}
