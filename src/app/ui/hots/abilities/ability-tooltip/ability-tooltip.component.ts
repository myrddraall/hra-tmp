import { Component, Input, OnInit } from '@angular/core';
import { HeroModel2, AbilityDefinitionModel } from 'hots-gamedata';

@Component({
  selector: 'hra-ability-tooltip',
  templateUrl: './ability-tooltip.component.html',
  styleUrls: ['./ability-tooltip.component.scss']
})
export class AbilityTooltipComponent implements OnInit {

  @Input()
  public ability: AbilityDefinitionModel;
  @Input()
  public hero: HeroModel2;

  constructor() { }

  ngOnInit(): void {
  }


  public get talents(){
    return this.hero?.getSelectedTalentsForAbility(this.ability?.id);
  }

}
