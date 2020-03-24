import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'hra-hex-button-border',
  templateUrl: './hex-button-border.component.html',
  styleUrls: ['./hex-button-border.component.scss']
})
export class HexButtonBorderComponent implements OnInit {

  @HostBinding('class.interactive-button')
  private className = true;

  constructor() { }

  ngOnInit(): void {
  }

}
