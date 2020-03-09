import { Component } from '@angular/core';
import './process-replay.worker.factory';
import { Replay } from 'replay-processor';
import {HotsDB, GitHubApi, GitHubDataRepo} from 'hots-gamedata';

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
   // const db = await HotsDB.getVersion();
   const g  = new GitHubDataRepo('HeroesToolChest', 'heroes-data', '2.48.1.76437');
   //const t  = await g.ls('/README.md');
   //console.log(t);
  }

  public async handleFileSelected(event: Event) {
    const fileList = (<HTMLInputElement>event.target).files;
    const file = fileList[0];
    if (file) {
      if (file.name.endsWith('.StormReplay')) {

      }
      const replay = new Replay(file);
      const unsub = replay.progress.subscribe(p => {
        console.log('~~~', p);
      });
      setTimeout(() => {
        unsub.unsubscribe();
      }, 5000);
      const r = await replay.init();
    }
  }
}
