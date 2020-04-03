import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'hra-cheveron-button-border',
  templateUrl: './cheveron-button-border.component.html',
  styleUrls: ['./cheveron-button-border.component.scss']
})
export class ChevronButtonBorderComponent implements OnInit {

  @HostBinding('attr.direction')
  @Input()
  public direction: 'left' | 'right' = 'left';
  
  @HostBinding('class.interactive-button')
  private className = true;

  constructor() { }

  ngOnInit(): void {
  }

}
