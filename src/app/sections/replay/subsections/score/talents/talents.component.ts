import { Component, ChangeDetectorRef } from '@angular/core';
import { ReplaySectionBase } from '../../ReplaySectionBase';
import { ActivatedRoute } from '@angular/router';
import { ITalentDataItem } from 'src/app/ui/hots/data-tables/talent-table/ITalentDataItem';

@Component({
  selector: 'app-talents',
  templateUrl: './talents.component.html',
  styleUrls: ['./talents.component.scss']
})
export class TalentsComponent extends ReplaySectionBase {

  public results: ITalentDataItem[];

  constructor(
    activeRoute: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef
  ) {
    super(activeRoute);
    activeRoute.data.subscribe(data => {
      this.results = data.talents;
      this.changeRef.markForCheck();
    });
    this.results = activeRoute.snapshot.data.talents;
  }

  async ngOnInit() {}

  protected async onReplayUpdate() {}


}
