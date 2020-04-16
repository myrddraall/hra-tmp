import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FancyTableComponent } from '../fancy-table/fancy-table.component';
import { MatTable } from '@angular/material/table';
import { IScoreScreenDataItem } from './IScoreScreenDataItem';
import linq from 'linq';
@Component({
  selector: 'hra-score-screen-table',
  templateUrl: './score-screen-table.component.html',
  styleUrls: [
    '../fancy-table/fancy-table.component.scss',
    './score-screen-table.component.scss'
  ]
})
export class ScoreScreenTableComponent extends FancyTableComponent {

  @ViewChild('table', { read: MatTable, static: true })
  private table: MatTable<any>;

  private _data: IScoreScreenDataItem[];
  private _bestMvpScore: number;
  private _bestMvpScoreTeam1: number;
  private _bestMvpScoreTeam2: number;

  private _sortBy: string;

  public get sortBy(): string {
    return this._sortBy;
  }

  public set sortBy(value: string) {
    if (this._sortBy !== value) {
      this._sortBy = value;
      this.updateList();
    }
  }

  public toggleSort(value: string) {
    if (this.sortBy === value) {
      this.sortBy = undefined;
    } else {
      this.sortBy = value;
    }
  }

  public list: IScoreScreenDataItem[];

  @Input()
  public get data(): IScoreScreenDataItem[] {
    return this._data;
  }

  public set data(value: IScoreScreenDataItem[]) {
    this._data = value;
    if (value) {
      this._bestMvpScore = linq.from(value).max(_ => _.mvpScore.Total);
      this._bestMvpScoreTeam1 = linq.from(value).where(_ => _.player.teamId === 0).max(_ => _.mvpScore.Total);
      this._bestMvpScoreTeam2 = linq.from(value).where(_ => _.player.teamId === 1).max(_ => _.mvpScore.Total);
      this.updateList();
    }
  }

  private updateList() {
    if (this.data) {
      let q = linq.from(this.data);
      if (this.sortBy) {
        q = q.orderByDescending(_ => _.sort[this.sortBy]);
      }
      this.list = q.toArray();
    }
  }

  public displayedColumns: string[] = [
    'Hero',
    // 'Awards',
    'MVPScoreBlizz',
    //'MVPScore',
    'Kills',
    'Assists',
    'Deaths',
    'SiegeDamage',
    'HeroDamage',
    'Healing',
    'SelfHealing',
    'DamageTaken',
    "XPContribution",
  ];

  constructor(
    private readonly changeRef: ChangeDetectorRef
  ) {
    super()
  }

  public isBest(item: IScoreScreenDataItem, stat: string): boolean {
    if (stat === "mvpScore") {
      return item.mvpScore.Total === this._bestMvpScore;
    }
    return item.gameSort[stat].max === item.sort[stat];
  }

  public isTeamBest(item: IScoreScreenDataItem, stat: string): boolean {
    if (stat === "mvpScore") {
      if (item.player.teamId === 0) {
        return item.mvpScore.Total === this._bestMvpScoreTeam1;
      }
      return item.mvpScore.Total === this._bestMvpScoreTeam2;
    }
    if (item.player.teamId === 0) {
      return item.team1Sort[stat].max === item.sort[stat];
    }
    return item.team2Sort[stat].max === item.sort[stat];
  }

}
