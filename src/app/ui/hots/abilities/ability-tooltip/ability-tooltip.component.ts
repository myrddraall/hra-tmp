import { Component, OnInit, Input } from '@angular/core';
import { IAbility, HeroModel } from 'hots-gamedata';

@Component({
  selector: 'hra-ability-tooltip',
  templateUrl: './ability-tooltip.component.html',
  styleUrls: ['./ability-tooltip.component.scss']
})
export class AbilityTooltipComponent implements OnInit {

  @Input()
  public ability: IAbility;
  @Input()
  public hero: HeroModel;

  constructor() { }

  ngOnInit(): void {
  }


  public get talents(){
    return this.hero?.getSelectedTalentsForAbility(this.ability?.id);
  }

}
