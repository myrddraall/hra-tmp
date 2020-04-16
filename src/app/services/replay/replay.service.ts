import { Injectable } from '@angular/core';
import { Match, ReplayWorker, IProgressEvent } from 'replay-processor';
import { IWebworkerRelay } from 'angular-worker-proxy';
import { Unsubscribable, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private _loadedReplays: Map<string, ReplayWorker> = new Map();
  private _progressSubReplays: Map<string, Unsubscribable> = new Map();
  private _loadedReplayIds: string[] = [];

  private _loadingProgress: Subject<IProgressEvent> = new Subject();

  public get loadingProgress():Observable<IProgressEvent>{
    return this._loadingProgress.asObservable();
  }
  constructor() { }

  public async loadReplay(file: File): Promise<Match> {
    console.time('loadReplay: ' + file.name);
    const replay = new ReplayWorker(file);
    const match = await this.initReplay(replay);
    console.timeEnd('loadReplay: ' + file.name);
    return match;
  }

  public async getReplay(id: string): Promise<ReplayWorker> {
    let replay = this._loadedReplays.get(id);
    if (!replay) {
      replay = await this.loadStoredReplay(id);
    }
    if (!replay) {
      throw new Error(`No replay data for '${id}'`);
    }
    return replay;
  }

  public async closeReplay(id: string): Promise<void> {
    const idx = this._loadedReplayIds.indexOf(id);
    if (idx !== -1) {
      const replay = this._loadedReplays.get(id);
      // close it
      (replay as unknown as IWebworkerRelay).dispose();
      this._loadedReplays.delete(id);
      this._loadedReplayIds.splice(idx, 1);
    }
  }

  private async loadStoredReplay(id: string) {
    if (ReplayWorker.hasReplayStored(id)) {
      const replay = new ReplayWorker(id);
      await this.initReplay(replay);
      return replay;
    }
  }


  private async initReplay(replay: ReplayWorker) {
    const unsub = replay.progress.subscribe((evt)=>{
      this._loadingProgress.next(evt);
    });
    const match = await replay.initializeMain();
    await this.closeReplay(match.id);
    this._loadedReplays.set(match.id, replay);
    this._loadedReplayIds.push(match.id);
    this.trimReplays();
    unsub.unsubscribe();
    return match;
  }

  private trimReplays() {
    while(this._loadedReplayIds.length > 5){
      this.closeReplay(this._loadedReplayIds[0]);
    }
  }

}
