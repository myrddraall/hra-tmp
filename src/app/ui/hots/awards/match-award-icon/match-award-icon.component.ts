import { Component, OnInit, Input, Inject } from '@angular/core';
import { IMatchAward } from 'hots-gamedata';
import { MATCH_AWARD_ICON_BASE_PATH } from '../tokens';

export interface IMatchAwardStats {
  sum: number;
  min: number;
  max: number;
  avg: number;
}

export interface IMatchAwardValues {
  player: number;
  game:IMatchAwardStats,
  team1:IMatchAwardStats,
  team2:IMatchAwardStats
}
export interface IMatchAwardEvaluated extends IMatchAward {
  value?: IMatchAwardValues;
}

@Component({
  selector: 'hra-match-award-icon',
  templateUrl: './match-award-icon.component.html',
  styleUrls: ['./match-award-icon.component.scss']
})
export class MatchAwardIconComponent implements OnInit {

  @Input()
  public award: IMatchAwardEvaluated;

  constructor(
    @Inject(MATCH_AWARD_ICON_BASE_PATH) private readonly basePath: string
  ) { }

  ngOnInit(): void {
  }

  public get iconUrl(): string {
    if (this.award) {
      return `${this.basePath}/${this.award.scoreScreenIcon}`;
    }
    return '';
  }

  public get iconLargeUrl(): string {
    if (this.award) {
      return `${this.basePath}/${this.award.mvpScreenIcon}`;
    }
    return '';
  }

}
