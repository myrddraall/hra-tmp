import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IMatch, ReplayWorker } from 'replay-processor';
import { ReplayService } from '../../../services/replay/replay.service';
import linq from 'linq';
import { SlotType } from 'heroesprotocol-data';
//import { IPlayer } from 'heroesprotocol-data';

@Component({
  selector: 'hra-matchinfo-bar',
  templateUrl: './matchinfo-bar.component.html',
  styleUrls: ['./matchinfo-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchinfoBarComponent implements OnChanges {
  private replay: ReplayWorker;

  public match: IMatch;

  public get team1Players(): any[] {
    return linq.from(this.match?.players || [])
      .where(_ => _.type === SlotType.PLAYER && _.teamId === 0)
      .toArray();
  }

  public get team2Players(): any[] {
    return linq.from(this.match?.players || [])
      .where(_ => _.type === SlotType.PLAYER && _.teamId === 1)
      .toArray();
  }

  @Input()
  public replayId: string;

  constructor(
    private readonly replayService: ReplayService,
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }


  private async update() {
    this.replay = await this.replayService.getReplay(this.replayId);
    this.match = await this.replay?.matchInfo.matchInfo;
    this.changeRef.markForCheck();
  }



}
