import { Component, OnInit, Input, Inject, HostBinding } from '@angular/core';
import { ITalent } from 'hots-gamedata';
import { TALENT_ICON_BASEURL } from '../tokens';
@Component({
  selector: 'hra-talent',
  templateUrl: './talent.component.html',
  styleUrls: [
    '../bordered-icon/styles/simple-square-border.scss',
    './talent.component.scss'
  ]
})
export class TalentComponent implements OnInit {
  @HostBinding('attr.selected')
  private _selected: string;

  @Input()
  public talent: ITalent;

  @Input()
  public get selected(): boolean {
    return this._selected === '';
  }
  public set selected(value: boolean) {
    this._selected = value ? '' : undefined;
  }

  @Input()
  public level: number;

  constructor(
    @Inject(TALENT_ICON_BASEURL) private readonly baseUrl: string
  ) { }

  public get iconUrl(): string {
    return this.talent && this.talent.icon ? `${this.baseUrl}/${this.talent.icon}` : '';
  }

  ngOnInit(): void {
    this.talent.energyCostDescription
  }

}
