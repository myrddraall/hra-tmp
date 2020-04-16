import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hra-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {

  @Input()
  public mapDefinition:any;

  constructor() { }

  ngOnInit(): void {
  }

}
