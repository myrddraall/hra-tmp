import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HeroModel2 } from 'hots-gamedata';
import { Unsubscribable } from 'rxjs';
import linq from 'linq';

@Component({
  selector: 'hra-hero-hud-unit',
  templateUrl: './hero-hud-unit.component.html',
  styleUrls: ['./hero-hud-unit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroHudUnitComponent implements OnChanges {

  @Input()
  public hero: HeroModel2;
  private levelSub: Unsubscribable;


  public get resourceColor(): string {
    switch (this.hero?.energyType?.toLowerCase()) {
      // Ammo Brew Charge
      case 'brew':
      case 'energy':
      case 'stored energy':
        return '#ffff0088';
      case 'fury':
        return '#ff330099';
      default:
        return '#0000ff77';
    }
  }

  public get resourceScale(): string {
    switch (this.hero?.energyType?.toLowerCase()) {
      case 'stored energy':
        const desc = linq.from(this.hero.abilities).where(_ => _.id === 'AurielBestowHope').select(_ => _.description).firstOrDefault();
        if (desc) {
          const matches = desc.match(/([\d]+)~~([\d\.]+)~~/);
          if (matches?.length === 3) {
            return `~~${matches[2]}~~`;
          }
        }
        return '++0++';
      case 'mana':
        return '++10++';
      case 'energy':
      case 'fury':
      default:
        return '++0++';
    }
  }
  constructor(
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hero) {
      if (this.levelSub) {
        this.levelSub.unsubscribe();
        this.levelSub = null;
      }
      if (this.hero) {
        this.levelSub = this.hero.levelChange.subscribe(() => {
          this.changeRef.markForCheck();
        });
      }
    }
  }

}
