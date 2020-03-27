import { Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HeroModel, IAbility } from 'hots-gamedata';
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
  private talentSub: Unsubscribable;

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
      if (this.talentSub) {
        this.talentSub.unsubscribe();
        this.talentSub = null;
      }
      if (this.hero) {
        this.levelSub = this.hero.levelChange.subscribe(() => {
          //this.changeRef.markForCheck();
        });
        this.formSub = this.hero.formChange.subscribe(() => {
          this.changeRef.markForCheck();
        });
        this.talentSub = this.hero.talentsChange.subscribe(() => {
          this.changeRef.markForCheck();
        });
      }

    }
  }

  public get abilityQ() {
    return this.hero.currentAbilities.find(_ => _.button.toUpperCase() === 'Q')
  }

  public get abilityW() {
    return this.hero.currentAbilities.find(_ => _.button.toUpperCase() === 'W')
  }

  public get abilityE() {
    return this.hero.currentAbilities.find(_ => _.button.toUpperCase() === 'E')
  }

  public get abilityR() {
    const heroics = this.findActiveHeroics();
    return heroics[0];
  }

  private findActiveHeroics(){
    return this.hero.currentAbilities.filter(_ => {
      return _.button === 'Heroic' && this.hero.isSelectedTalentAbilityId(_.id);
    });
  }

  public get abilityD() {
    const heroics = this.findActiveHeroics();
    if(heroics.length === 2){
      return heroics[1];
    }
    return this.hero.currentAbilities.find(_ => _.button === 'Trait')
  }

  public get abilitiesActive() {
    return this.hero.currentAbilities.filter(_ => _.button === 'Active')
  }

  public abilityTrackBy(index:number, item:IAbility){
    return item.icon;
  }

}
