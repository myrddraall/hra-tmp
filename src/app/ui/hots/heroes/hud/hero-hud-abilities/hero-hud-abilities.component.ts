import { Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HeroModel } from 'hots-gamedata';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'hra-hero-hud-abilities',
  templateUrl: './hero-hud-abilities.component.html',
  styleUrls: ['./hero-hud-abilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroHudAbilitiesComponent implements OnChanges {

  @Input()
  public hero: HeroModel;
  private levelSub: Unsubscribable;
  private formSub: Unsubscribable;
  
  constructor(
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hero) {
      if (this.levelSub) {
        this.levelSub.unsubscribe();
        this.levelSub = null;
      }
      if (this.formSub) {
        this.formSub.unsubscribe();
        this.formSub = null;
      }
      if (this.hero) {
        this.levelSub = this.hero.levelChange.subscribe(() => {
          //this.changeRef.markForCheck();
        });
        this.formSub = this.hero.formChange.subscribe(() => {
          this.changeRef.markForCheck();
        });
      }
      
    }
  }

  public get abilityQ(){
    return this.hero.abilities.find(_ => _.button.toUpperCase() === 'Q')
  }

  public get abilityW(){
    return this.hero.abilities.find(_ => _.button.toUpperCase() === 'W')
  }

  public get abilityE(){
    return this.hero.abilities.find(_ => _.button.toUpperCase() === 'E')
  }

  public get abilityR(){
    return this.hero.abilities.find(_ => _.button.toUpperCase() === 'R')
  }

  public get abilityD(){
    return this.hero.abilities.find(_ => _.button === 'Trait')
  }

}
