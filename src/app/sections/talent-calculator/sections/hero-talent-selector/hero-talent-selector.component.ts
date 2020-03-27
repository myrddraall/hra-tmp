import { Component, OnInit, OnChanges, HostBinding, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, } from '@angular/router';
import { IHero, ITalent, HeroModel, TalentTeir } from 'hots-gamedata';
import { HeroStringsUtil } from 'hots-gamedata';
import { TalentCalculatorComponent } from '../../talent-calculator.component';

@Component({
  selector: 'app-hero-talent-selector',
  templateUrl: './hero-talent-selector.component.html',
  styleUrls: ['./hero-talent-selector.component.scss']
})
export class HeroTalentSelectorComponent implements OnInit, OnChanges {
  /*public _selectedTalents = {
    '1': -1,
    '4': -1,
    '7': -1,
    '10': -1,
    '13': -1,
    '16': -1,
    '20': -1,
  }*/
  private _hero: HeroModel;



  public _selectedValue: number = 0;
  // public _selectedValue: number;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly parent: TalentCalculatorComponent
  ) {

    parent.modeChanged.subscribe((value) => {
      this.displayMode = value;
    });
    this.route.data.subscribe(data => {
      if (this._hero?.id !== data.hero.id) {
        this._hero = new HeroModel(data.hero);
        this.update();
      }
    });
    this.route.params.subscribe(params => {
      if (this._hero) {
        this.update();
      }
    })
  }

  @HostBinding('attr.display-mode')
  public displayMode: 'icon' | 'tile' = 'icon';

  public get hero(): HeroModel {
    return this._hero;
  }

  public get bgUrl(): string {
    if (!this._hero) {
      return '';
    }
    const nName = HeroStringsUtil.normalizeStringNoSpace(this.hero.heroName, '-').toLowerCase();
    const nTtite = HeroStringsUtil.normalizeStringNoSpace(this.hero.title, '-').toLowerCase();
    if (nName === 'valeera') {
      return `https://static.heroesofthestorm.com/heroes/${nName}/skins/standard/${nTtite}.jpg`
    }
    if (nName === 'cho' || nName === 'gall' || nName === 'greymane') {
      return `https://static.heroesofthestorm.com/heroes/${nName}/skins/${nName}/${nTtite}.jpg`
    }
    return `https://static.heroesofthestorm.com/heroes/${nName}/skins/${nTtite}.jpg`
  }

  ngOnInit() {
    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._hero.talentBuildUrl = base36;
  }


  public update(): void {
    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._hero.talentBuildUrl = base36;
  }

  ngOnChanges(changes): void {
    if (changes.hero) {
      this.update();
    }
  }

  selectTalent(tier: TalentTeir, index: number) {
    this.hero.selectTalentByIndex(tier, index);
    this.updateUrl();
  }

  getSelected(tier: TalentTeir) {
    return this.hero.getSelectedTalentIndex(tier);
  }

  isSelected(tier: TalentTeir, index: number) {
    return this.hero.isSelectedTalentIndex(tier, index);
  }


  private updateUrl() {
    const buildStr = this.hero ? this.hero.talentBuildUrl : '';
    const path = this.router.createUrlTree(['/talent-calculator', this.hero.id, buildStr]);
    this.location.go(path.toString())

  }
}
