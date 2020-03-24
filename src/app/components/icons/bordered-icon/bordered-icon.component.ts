import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bordered-icon',
  templateUrl: './bordered-icon.component.html',
  styleUrls: ['./bordered-icon.component.scss']
})
export class BorderedIconComponent implements OnInit {

  @Input()
  public  clip: string;

  @Input('translate.clip')
  public clipTranslate: string;

  @Input('translate.image')
  public imgTranslate: string;

  @Input('translate')
  public translate: string;

  @Input()
  public coordinates: 'abs' | '%' | 'x%' | 'y%';

  @Input()
  public src: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
