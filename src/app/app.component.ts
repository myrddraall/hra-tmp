import { Component } from '@angular/core';
import './process-replay.worker.factory';
import { ReplayWorker } from 'replay-processor';
import { HotsDB, GitHubApi, HeroesDataApi } from 'hots-gamedata';
import { GameVersion } from 'heroesprotocol-data';
import { ReplayService } from './services/replay/replay.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'heroes-replay-analyser';
  //replay = new Replay();
  public loading: boolean = true;
  constructor(
    private readonly replayService: ReplayService,
    private readonly router: Router
  ) {
    this.init()
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }else if(event instanceof NavigationEnd){
        this.loading = false;
      }
    });
  }

  async  init() {
    // const db = await HotsDB.getVersion(new GameVersion('2.48.1.96437')); 
    // const hcollection = await db.heroes;
    //hcollection.
  }

  public async handleFileSelected(event: Event) {
    const fileList = (<HTMLInputElement>event.target).files;
    const file = fileList[0];
    if (file) {
      if (file.name.endsWith('.StormReplay')) {
        const match = await this.replayService.loadReplay(file);
        console.log(match);
        this.router.navigate(['/match', match.id]);
        /* const replay = new ReplayWorker(file);
         replay.progress.subscribe( _ => {
           //console.log(_);
         })
         const result = await replay.initialize();
 console.log(result);
         /*setTimeout(()=>{
           unsub.unsubscribe();
         }, 7000)*/
        //const r = await replay.matchInfo2.test()
        // console.log('-----------------------', r);

        //const r2 = await replay.matchInfo2.test2('hi');
        //console.log('-----------------------', r2);
        //  const r = await replay.init();
        // console.log('-----------------------', r);
        // await replay.matchInfo.test();
      }
    }
  }
}
