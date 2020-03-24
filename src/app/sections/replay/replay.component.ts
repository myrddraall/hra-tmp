import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent implements OnInit {
  public mode = '%';
  constructor(
    private readonly activeRoute:ActivatedRoute
  ) { }

  public get replayId():string{
    return this.activeRoute.snapshot.params.replayId;
  }

  ngOnInit(): void {
  }

}
