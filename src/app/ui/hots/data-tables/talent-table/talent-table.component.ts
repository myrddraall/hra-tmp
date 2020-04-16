import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ITalentDataItem } from './ITalentDataItem';
import { FancyTableComponent } from '../fancy-table/fancy-table.component';

@Component({
  selector: 'hra-talent-table',
  templateUrl: './talent-table.component.html',
  styleUrls: [
    '../fancy-table/fancy-table.component.scss',
    './talent-table.component.scss'
  ]
})
export class TalentTableComponent extends FancyTableComponent {

  @Input()
  public data: ITalentDataItem[];
  public displayedColumns: string[] = [
    'Hero',
    'Talents',
    'Tools'
  ];
  constructor(
    private readonly changeRef: ChangeDetectorRef
  ) {
    super()
  }

}
