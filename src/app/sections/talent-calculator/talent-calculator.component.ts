import { Component, OnInit, ElementRef, OnDestroy, HostBinding, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHeroListItem } from 'hots-gamedata';
import { BehaviorSubject } from 'rxjs';
import ResizeObserver from 'resize-observer-polyfill';
import { get, set } from 'idb-keyval';
import { FavouriteTalentbuildsService } from './services/favourite-talentbuilds-service/favourite-talentbuilds.service';
import { HeroTalentSelectorComponent } from './sections/hero-talent-selector/hero-talent-selector.component';

@Component({
  selector: 'app-talent-calculator',
  templateUrl: './talent-calculator.component.html',
  styleUrls: ['./talent-calculator.component.scss']
})
export class TalentCalculatorComponent implements OnInit, OnDestroy {


  private _selectedTalentBuild: string;
  public forceIconMode: boolean = false;
  private _mode: 'icon' | 'tile';
  public modeChanged: BehaviorSubject<'icon' | 'tile'> = new BehaviorSubject(undefined);

  public get heroList(): IHeroListItem[] {
    return this.route.snapshot.data.heroList;
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly elmRef: ElementRef<HTMLElement>,
    private readonly favoriteBuildsService: FavouriteTalentbuildsService,
    private readonly changeRef: ChangeDetectorRef,
  ) {
    this.init();
  }

  public isFavorite: boolean = false;


  private checkMode() {
    const value = this.elmRef.nativeElement.getAttribute('max-width');
    this.forceIconMode = value === '1199px';
    this.modeChanged.next(this.activeMode);
    return this.activeMode;
  }

  private async init() {
    this._mode = await get<'icon' | 'tile'>('__talent-calculator__.displayMode') || 'tile';
    this.checkMode();
    this.favoriteBuildsService.builds.subscribe(async builds => {
      console.log('builds changed', builds);
      this.isFavorite = await this.favoriteBuildsService.hasBuild(this.selectedHeroId, this.selectedTalentBuild);
      this.changeRef.markForCheck();
    });
  }
  private _resizeObs: MutationObserver;

  async ngOnInit() {
    if (this._resizeObs) {
      this._resizeObs.disconnect();
    }

    this._resizeObs = new MutationObserver(records => {
      const value = this.elmRef.nativeElement.getAttribute('max-width');
      if (records[0] && records[0].oldValue !== value) {
        this.checkMode();
      }
    });
    this._resizeObs.observe(this.elmRef.nativeElement, { attributeFilter: ['max-width'], attributes: true, attributeOldValue: true })
    // this.checkMode();
  }

  public async favoriteTalentBuild() {
    if (this.selectedTalentBuild && this.selectedHeroId) {
      if (await this.favoriteBuildsService.hasBuild(this.selectedHeroId, this.selectedTalentBuild)) {
        await this.favoriteBuildsService.deleteBuild(this.selectedHeroId, this.selectedTalentBuild);
      } else {
        await this.favoriteBuildsService.saveBuild({
          name: '',
          description: '',
          build: this.selectedTalentBuild,
          hero: this.selectedHeroId
        });
      }
    }
  }

  ngOnDestroy() {
    if (this._resizeObs) {
      this._resizeObs.disconnect();
    }
  }

  @HostBinding('attr.mode')
  public get activeMode(): 'icon' | 'tile' {
    return this.forceIconMode ? 'icon' : this._mode;
  }

  public get mode(): 'icon' | 'tile' {
    return this._mode;
  }

  public set mode(value: 'icon' | 'tile') {
    if (this.mode !== value) {
      this._mode = value;
      set('__talent-calculator__.displayMode', value);
      this.modeChanged.next(value);
    } else {
      this._mode = value;
      set('__talent-calculator__.displayMode', value);
    }
  }

  public get selectedHeroId(): string {
    return this.route.snapshot.firstChild.params.heroId;
  }

  public get selectedTalentBuild(): string {
    return this._selectedTalentBuild;
  }

  public set selectedTalentBuild(value: string) {
    this._selectedTalentBuild = value;
    (async () => {
      this.isFavorite = await this.favoriteBuildsService.hasBuild(this.selectedHeroId, this.selectedTalentBuild);
      this.changeRef.markForCheck();
    })();
  }

  public onHeroSelect(heroId: string) {
    if (heroId && heroId !== this.selectedHeroId) {
      this.router.navigate([heroId], { relativeTo: this.route });
    }
  }

}
