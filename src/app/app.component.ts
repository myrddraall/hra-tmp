import { Component } from '@angular/core';
import './process-replay.worker.factory';
import { Replay } from 'replay-processor';
import {HotsDB, GitHubApi, HeroesDataApi} from 'hots-gamedata';
import { GameVersion } from 'heroesprotocol-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'heroes-replay-analyser';
  //replay = new Replay();

  constructor() {
    this.init()
  }

  async  init(){
    const db = await HotsDB.getVersion(new GameVersion('2.48.1.96437')); 
    const hcollection = await db.heroes;
    //hcollection.
  }

  public async handleFileSelected(event: Event) {
    const fileList = (<HTMLInputElement>event.target).files;
    const file = fileList[0];
    if (file) {
      if (file.name.endsWith('.StormReplay')) {
        const replay = new Replay(file);
        const r = await replay.init();
        console.log('-----------------------', r);
      }
    }
  }
}
