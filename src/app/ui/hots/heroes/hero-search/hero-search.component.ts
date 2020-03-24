import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { IBasicHeroModel } from 'hots-gamedata';

import { CollapsableComponent } from 'src/app/ui/common/containers/collapsable/collapsable.component';
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

  public opened: boolean;

  public open(){
    this.opened = true;
    setTimeout(()=>{
      this.focusUpdates.next(true);
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

  ngOnInit(): void {
    this.visibleHeroList = this.heroList;
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
      value = value || '';
      value = value.toLowerCase();
      if (this.previousSearch !== value) {

        let q: IEnumerable<IBasicHeroModel>;
        if (!value || !this.previousSearch || value.indexOf(this.previousSearch) !== 0) {
          q = linq.from(this.heroList);
        } else {
          q = linq.from(this.visibleHeroList);
        }

        this.visibleHeroList = q.where(hero => {
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
        }).toArray();
        console.log('search change', value, this.visibleHeroList);
        this.previousSearch = value;
      }
      //linq.from(this.heroList)
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

  public setSelected(hero: IBasicHeroModel | string): void {
    if (typeof hero !== 'string') {
      hero = hero?.id;
    }
    this.value = hero;
    this.selectedHero = this.heroList.find(_ => _.id === hero);

  }
}
