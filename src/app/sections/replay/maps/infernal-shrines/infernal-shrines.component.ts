import { Component, OnInit } from '@angular/core';
import { IMap } from '../map/IMap';

@Component({
  selector: 'app-infernal-shrines',
  templateUrl: './infernal-shrines.component.html',
  styleUrls: [
    '../map/map-base.component.scss',
    './infernal-shrines.component.scss'
  ]
})
export class InfernalShrinesComponent implements OnInit {

  public mapDef:IMap = {
    width: 248,
    height: 216,
    image: ''
  }

  constructor() { }

  ngOnInit(): void {
  }

}
