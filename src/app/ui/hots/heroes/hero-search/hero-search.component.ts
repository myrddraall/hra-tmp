import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostBinding } from '@angular/core';
import { IBasicHeroModel } from 'hots-gamedata';
import { CollapsableComponent } from '@ngui/application'
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import linq from 'linq';
import { IEnumerable } from 'linq';
@Component({
  selector: 'hra-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  @ViewChild('search')
  private search: ElementRef<HTMLInputElement>;
  @ViewChild('details')
  private container: CollapsableComponent;

  @HostBinding('class.animating')
  public animating: boolean = false;

  private _selected: string;
  private searchUpdates: Subject<string> = new Subject();
  private focusUpdates: Subject<boolean> = new Subject();
  public selectedHero: IBasicHeroModel;
  @Input()
  public heroList: IBasicHeroModel[];

  @Input()
  public get value(): string {
    return this._selected;
  }

  public erFilter: Set<string> = new Set();
  public fFilter: Set<string> = new Set();

  @HostBinding('class.opened')
  public opened: boolean;

  public open() {
    this.opened = true;
    setTimeout(() => {
      this.focusUpdates.next(true);
    })
  }

  public close() {
    this.opened = false;
    setTimeout(() => {
      this.focusUpdates.next(false);
    })
  }

  public set value(value: string) {
    if (this._selected !== value) {
      this._selected = value;
      this.selectedHero = this.heroList.find(_ => _.id === value);
      this.valueChange.emit(value);
    }
  }

  @Output()
  public valueChange: EventEmitter<string> = new EventEmitter();


  public visibleHeroList: IBasicHeroModel[];
  private previousSearch: string

  constructor() { }

  public setERFilter(value: string) {
    //this.search?.nativeElement.focus();
    if (this.erFilter.has(value)) {
      this.erFilter.delete(value);
    } else {
      this.erFilter.add(value);
    }
    this.focusUpdates.next(true);
    this.doFilter();
  }

  public setFFilter(value: string) {
    //this.search?.nativeElement.focus();
    if (this.fFilter.has(value)) {
      this.fFilter.delete(value);
    } else {
      this.fFilter.add(value);
    }
    this.focusUpdates.next(true);
    this.doFilter();
  }

  ngOnInit(): void {
    if (!this.value) {
      this.opened = true;
    }
    this.doFilter();
    this.focusUpdates.pipe(debounceTime(200)).subscribe(value => {
      if (value) {
        this.search.nativeElement.focus();
        this.container.open = true;
        this.opened = true;
      } else {
        this.container.open = false;
        this.opened = false;
      }
    });
    this.searchUpdates.pipe(debounceTime(200)).subscribe(value => {
      this.doFilter();
    });
  }

  trackBy(index, item: IBasicHeroModel) {
    return item.id;
  }

  updateFocus(focus: boolean) {
    this.focusUpdates.next(focus);
  }

  updateSearch() {
    this.searchUpdates.next(this.search.nativeElement.value);
  }

  private doFilter() {
    let q: IEnumerable<IBasicHeroModel> = linq.from(this.heroList);

    if (this.erFilter.size) {
      q = q.where(_ => {
        let role = _.expandedRole.toLowerCase().split(' ')[0];
        return this.erFilter.has(role);
      });
    }

    if (this.fFilter.size) {
      q = q.where(_ => {
        let franchise = _.franchise.toLowerCase();
        switch (franchise) {
          case 'warcraft':
          case 'starcraft':
          case 'overwatch':
          case 'diablo':
            break;
          default:
            franchise = 'nexus';
        }
        return this.fFilter.has(franchise);
      });
    }

    if (this.search?.nativeElement.value) {
      const value = this.search.nativeElement.value.toLowerCase();
      q = q.where(hero => {
        if (hero.name.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.title.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.gender.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.role.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.expandedRole.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.difficulty.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.searchText && hero.searchText.toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        if (hero.tags && hero.tags.join(' ').toLowerCase().indexOf(value) !== -1) {
          return true;
        }
        return false;
      });
    }

    this.visibleHeroList = q.orderBy(_ => _.name).toArray();
  }

  public setSelected(hero: IBasicHeroModel | string): void {
    if (typeof hero !== 'string') {
      hero = hero?.id;
    }
    this.value = hero;
    this.selectedHero = this.heroList.find(_ => _.id === hero);
    this.opened = false;
  }
}
