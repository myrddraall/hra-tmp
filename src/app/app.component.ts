import { Component } from '@angular/core';
import './process-replay.worker.factory';
import { ReplayWorker } from 'replay-processor';
import { HotsDB, GitHubApi, HeroesDataApi } from 'hots-gamedata';
import { GameVersion } from 'heroesprotocol-data';
import { ReplayService } from './services/replay/replay.service';
import { Router, NavigationStart, NavigationEnd,  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'heroes-replay-analyser';
  //replay = new Replay();
  public _loadingRoute: boolean = true;
  public _loadingReplay: boolean = false;
  constructor(
    private readonly replayService: ReplayService,
    private readonly router: Router
  ) {
    this.init()
    router.events.subscribe(event => {
      console.log(event);
      if (event instanceof NavigationStart) {
        this._loadingRoute = true;
      } else if (event instanceof NavigationEnd) {
        this._loadingRoute = false;
        console.log('LOADING', this.loading);
      }
    });
    replayService.loadingProgress.subscribe(evt => {
      this._loadingReplay = true;
      if(evt.overall.loaded === evt.overall.total){
        this._loadingReplay = false;
        console.log('LOADING', this.loading);
      }
    });
  }

  public get loading():boolean{
    return this._loadingReplay || this._loadingRoute;
  }
  async  init() {
    // const db = await HotsDB.getVersion(new GameVersion('2.48.1.96437')); 
    // const hcollection = await db.heroes;
    //hcollection.
  }

 
}
