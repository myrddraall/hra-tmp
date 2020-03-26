import { Component, OnInit, ElementRef, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHeroListItem } from 'hots-gamedata';
import { BehaviorSubject } from 'rxjs';
import ResizeObserver from 'resize-observer-polyfill';
import { get, set } from 'idb-keyval';

@Component({
  selector: 'app-talent-calculator',
  templateUrl: './talent-calculator.component.html',
  styleUrls: ['./talent-calculator.component.scss']
})
export class TalentCalculatorComponent implements OnInit, OnDestroy {

  public forceIconMode: boolean = false;
  private _mode: 'icon' | 'tile';
  public modeChanged: BehaviorSubject<'icon' | 'tile'> = new BehaviorSubject(undefined);

  public get heroList(): IHeroListItem[] {
    return this.route.snapshot.data.heroList;
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly elmRef: ElementRef<HTMLElement>
  ) {
    this.init();
  }

  private checkMode(){
    const value = this.elmRef.nativeElement.getAttribute('max-width');
    this.forceIconMode = value === '1199px';
    this.modeChanged.next(this.activeMode);
    return this.activeMode;
  }

  private async init() {
    this._mode = await get<'icon' | 'tile'>('__talent-calculator__.displayMode') || 'tile';
    this.checkMode();
    //console.log('MODE!', this._mode);
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

  public onHeroSelect(heroId: string) {
    if (heroId && heroId !== this.selectedHeroId) {
      this.router.navigate([heroId], { relativeTo: this.route });
    }
  }

}
