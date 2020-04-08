import { Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HeroModel2, IAbility } from 'hots-gamedata';
import { Unsubscribable } from 'rxjs';


@Component({
  selector: 'hra-hero-hud-abilities',
  templateUrl: './hero-hud-abilities.component.html',
  styleUrls: ['./hero-hud-abilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroHudAbilitiesComponent implements OnChanges {

  @Input()
  public hero: HeroModel2;
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
        this.talentSub = this.hero.selectedTalentsChange.subscribe(() => {
          this.changeRef.markForCheck();
        });
      }

    }
  }

  public abilityTrackBy(index:number, item:IAbility){
    return item.icon;
  }

}
