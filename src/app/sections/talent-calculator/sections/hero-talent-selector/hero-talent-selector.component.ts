import { Location } from '@angular/common';
import { Component, ElementRef, HostBinding, OnChanges, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroModel, HeroStringsUtil, TalentTeir } from 'hots-gamedata';
import { Unsubscribable } from 'rxjs';
import { TalentCalculatorComponent } from '../../talent-calculator.component';
import { ElementResizeObserver } from '@ngui/responsive'
import { get, set } from 'idb-keyval';

@Component({
  selector: 'app-hero-talent-selector',
  templateUrl: './hero-talent-selector.component.html',
  styleUrls: ['./hero-talent-selector.component.scss']
})
export class HeroTalentSelectorComponent implements OnInit, OnChanges, OnDestroy {

  private _hero: HeroModel;
  private forceIconModeAt = 1399;
  public forceIconMode: boolean = false;
  private _mode: 'icon' | 'tile';


  private _subs: Unsubscribable[] = [];
  private _herosubs: Unsubscribable[] = [];

  public _selectedValue: number = 0;
  // public _selectedValue: number;
  constructor(
    private readonly elmRef: ElementRef<HTMLElement>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly parent: TalentCalculatorComponent,
    private readonly changeRef: ChangeDetectorRef,
  ) {
    this._subs.push(new ElementResizeObserver(elmRef.nativeElement).subscribe(size =>{
      this.forceIconMode = size.width <= this.forceIconModeAt;
      this.changeRef.markForCheck();
    }));
    /*this._subs.push(parent.modeChanged.subscribe((value) => {
      this.displayMode = value;
    }));
    */
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
  public get displayMode(): 'icon' | 'tile'{
    return this.forceIconMode ? 'icon' : this._mode;
  }

  public get mode(): 'icon' | 'tile'{
    return this._mode;
  }

  public set mode(value: 'icon' | 'tile') {
    if (this.mode !== value) {
      this._mode = value;
      set('__talent-calculator__.displayMode', value);
      //this.modeChanged.next(value);
    } else {
      this._mode = value;
      set('__talent-calculator__.displayMode', value);
    }
  }

  public get url(){
    return location.href;
  }


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

  async ngOnInit() {
    this._mode = await get<'icon' | 'tile'>('__talent-calculator__.displayMode') || 'tile';

    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._hero.talentBuildUrl = base36;
  }


  public update(): void {
    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._hero.talentBuildUrl = base36;
    this.unsubHero();
    this._herosubs.push(this._hero.talentsChange.subscribe(_ => {
       this.parent.selectedTalentBuild = this._hero.talentBuildUrl;
      //this.changeRef.markForCheck();
    }));
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
  private unsubHero() {
    if (this._herosubs) {
      for (const sub of this._herosubs) {
        sub.unsubscribe();
      }
    }
    this._herosubs = [];
  }

  public ngOnDestroy() {
    if (this._subs) {
      for (const sub of this._subs) {
        sub.unsubscribe();
      }
    }
    this.unsubHero();
  }
}
