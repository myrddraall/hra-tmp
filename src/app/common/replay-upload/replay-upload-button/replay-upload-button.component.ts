import { Component, OnInit } from '@angular/core';
import { ReplayService } from 'src/app/services/replay/replay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'hra-replay-upload-button',
  templateUrl: './replay-upload-button.component.html',
  styleUrls: ['./replay-upload-button.component.scss']
})
export class ReplayUploadButtonComponent implements OnInit {
  public state = 0;
  constructor(
    private readonly replayService: ReplayService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
  }

  public onStateChange(state: number) {
    this.state = state;
  }

  public async onFileSelect(file: File) {
    const match = await this.replayService.loadReplay(file);
    this.router.navigate(['/match', match.id, match.mapId]);
  }

}
