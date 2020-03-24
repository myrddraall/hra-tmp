import { Injectable } from '@angular/core';

import { ReplayWorker, IMatch } from 'replay-processor';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private _loadedReplays: Map<string, ReplayWorker> = new Map();
  constructor() { }

  public async loadReplay(file: File): Promise<IMatch> {
    console.time('loadReplay: ' + file.name);
    const replay = new ReplayWorker(file);
    const match = await replay.initialize();
    this._loadedReplays.set(match.id, replay);
    console.timeEnd('loadReplay: ' + file.name);
    return match;
  }

  public async getReplay(id: string): Promise<ReplayWorker> {
    return this._loadedReplays.get(id);
  }

  public async closeReplay(id: string): Promise<void> {
    const replay =  this._loadedReplays.get(id);
    // close it

    this._loadedReplays.delete(id);
  }

}
