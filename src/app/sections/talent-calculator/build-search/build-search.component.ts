import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostBinding, OnChanges, SimpleChanges, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { IBasicHeroModel, HeroModel, HotsDB, IHero } from 'hots-gamedata';

import { CollapsableComponent } from 'src/app/ui/common/containers/collapsable/collapsable.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import linq from 'linq';
import { IEnumerable } from 'linq';
import { IFavouriteTalentBuild } from '../services/favourite-talentbuilds-service/IFavouriteTalentBuild';
import { FavouriteTalentbuildsService } from '../services/favourite-talentbuilds-service/favourite-talentbuilds.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GameVersion } from 'heroesprotocol-data/lib';
import { MatDialog } from '@angular/material/dialog';

interface IHeroBuilds {
  hero: HeroModel,
  builds: Array<IFavouriteTalentBuild & { model: HeroModel }>
}

@Component({
  selector: 'hra-build-search',
  templateUrl: './build-search.component.html',
  styleUrls: ['./build-search.component.scss']
})
export class BuildSearchComponent implements OnInit, OnChanges {

  @ViewChild('search')
  private search: ElementRef<HTMLInputElement>;
  @ViewChild('details')
  private container: CollapsableComponent;

  @ViewChild('AddEditBuildDialog', { read: TemplateRef, static: true })
  private addEditBuildDialog: TemplateRef<any>

  private searchUpdates: Subject<string> = new Subject();
  private focusUpdates: Subject<boolean> = new Subject();
  private _build: string;
  public heroList: IHero[];
  public buildList: IFavouriteTalentBuild[];


  public heroBuilds: IHeroBuilds[];
  public visibleHeroList: IHeroBuilds[];


  public erFilter: Set<string> = new Set();
  public fFilter: Set<string> = new Set();

  @Input()
  public heroId: string;
  @Input()
  public get build(): string {
    return this._build;
  }
  public set build(value: string) {
    this._build = value;
    (async () => {
      this.isFavorite = await this.favouriteBuildsService.hasBuild(this.heroId, this.build);
      this.changeRef.markForCheck();
    })();
  }

  @HostBinding('class.opened')
  public opened: boolean;

  @HostBinding('class.animating')
  public animating: boolean = false;

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


  public isFavorite = true;


  private gameVersion: GameVersion;

  constructor(
    private readonly favouriteBuildsService: FavouriteTalentbuildsService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
    favouriteBuildsService.builds.subscribe(async builds => {
      this.buildList = builds;
      await this.init();
      this.doFilter();
      this.isFavorite = await this.favouriteBuildsService.hasBuild(this.heroId, this.build);
      this.changeRef.markForCheck();
    });

  }

  private async init() {
    if (!this.heroList) {
      const db = await HotsDB.getVersion('latest');

      const heroCollection = await db.heroes;
      this.gameVersion = await heroCollection.version;
      const heroIds = await heroCollection.getHeroIds();
      const heroes: IHero[] = [];
      for (const heroId of heroIds) {
        heroes.push(await heroCollection.getHero(heroId));
      }
      // db.version
      this.heroList = heroes;
    }
    let q = linq.from(this.buildList).groupBy(_ => _.hero, _ => _, (key, _) => ({
      heroId: key,
      builds: _.orderByDescending(_ => _.lastUpdated).toArray()
    })).join(
      this.heroList,
      o => o.heroId,
      i => i.id,
      (heroBuilds, hero) => ({
        hero: new HeroModel(hero),
        builds: linq.from(heroBuilds.builds).select(_ => {
          const h = new HeroModel(hero);
          h.talentBuildUrl = _.build
          return {
            ..._,
            model: h
          };
        }).toArray()
      })
    );

    this.heroBuilds = q.toArray();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.heroId && this.build) {
      this.isFavorite = await this.favouriteBuildsService.hasBuild(this.heroId, this.build);
      this.changeRef.markForCheck();
    } else {
      this.isFavorite = false;
    }
  }

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
    this.opened = false;
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

  trackHeroBy(index, item: IHeroBuilds) {
    return item.hero.id;
  }

  trackBuildBy(index, item: IFavouriteTalentBuild) {
    return item.build;
  }

  updateFocus(focus: boolean) {
    this.focusUpdates.next(focus);
  }

  updateSearch() {
    this.searchUpdates.next(this.search.nativeElement.value);
  }

  public async favouriteTalentBuild() {

    if (this.build && this.heroId) {
      let build;
      if (await this.favouriteBuildsService.hasBuild(this.heroId, this.build)) {
        build = await this.favouriteBuildsService.getBuild(this.heroId, this.build);
      }else{
        build = {
          name: '',
          gameVersion: this.gameVersion,
          lastUpdated: new Date(),
          description: '',
          build: this.build,
          hero: this.heroId
        };
      }
      this.modifyBuild(build);
    }
  }

  public async modifyBuild(build: IFavouriteTalentBuild) {
    const isCurrent = build.hero === this.heroId && build.build === this.build;
    const isSaved = await this.favouriteBuildsService.hasBuild(build.hero, build.build);
    const dRef = this.dialog.open(this.addEditBuildDialog, {
      panelClass: 'hra-dialog',
      data: { build: {...build}, isSaved, isCurrent }
    });
    const r = await dRef.afterClosed().toPromise();
    if (r === 'delete') {
      await this.favouriteBuildsService.deleteBuild(build.hero, build.build);
      if (isCurrent) {
        this.isFavorite = false;
      }
      this.changeRef.markForCheck();
    } else if (r) {
      await this.favouriteBuildsService.saveBuild(r);
      if (isCurrent) {
        this.isFavorite = true;
      }
      this.changeRef.markForCheck();
    }
  }

  private doFilter() {
    let q = linq.from(this.heroBuilds);

    if (this.erFilter.size) {
      q = q.where(_ => {
        let role = _.hero.expandedRole.toLowerCase().split(' ')[0];
        return this.erFilter.has(role);
      });
    }

    if (this.fFilter.size) {
      q = q.where(_ => {
        let franchise = _.hero.franchise.toLowerCase();
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
      q = q.where(_ => {
        const hero = _.hero;
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

    this.visibleHeroList = q.orderBy(_ => _.hero.id).toArray();

  }

  public setSelected(build: IFavouriteTalentBuild, event: MouseEvent): void {
    if (!event.defaultPrevented) {
      this.router.navigate([build.hero, build.build], {
        relativeTo: this.route
      });
      setTimeout(() => {
        this.opened = false;
        this.updateFocus(false);
      })
    }
  }

  public async deleteBuild(build: IFavouriteTalentBuild) {
    await this.favouriteBuildsService.deleteBuild(build.hero, build.build);
    this.changeRef.markForCheck();
  }

  public isSelected(build: IFavouriteTalentBuild): boolean {
    return build.hero === this.heroId && build.build === this.build;
  }
}
