import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IScoreScreenDataItem } from '../../../../../ui/hots/data-tables/score-screen-table/IScoreScreenDataItem';
import { ReplaySectionBase } from '../../ReplaySectionBase';


@Component({
  selector: 'app-score-screen',
  templateUrl: './score-screen.component.html',
  styleUrls: ['./score-screen.component.scss']
})
export class ScoreScreenComponent extends ReplaySectionBase implements OnInit {

  public results: IScoreScreenDataItem[];

  constructor(
    activeRoute: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef
  ) {
    super(activeRoute);
    activeRoute.data.subscribe(data => {
      this.results = data.scores;
      this.changeRef.markForCheck();
    });
    this.results = activeRoute.snapshot.data.scores;
  }

  async ngOnInit() {}

  protected async onReplayUpdate() {}




}
