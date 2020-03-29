import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'hra-link-copy-button',
  templateUrl: './link-copy-button.component.html',
  styleUrls: ['./link-copy-button.component.scss']
})
export class LinkCopyButtonComponent implements OnInit {

  @Input()
  public url:string;

  @Input()
  public label:string;

  @Input()
  @HostBinding('class.show-navigate')
  public showNavigate:boolean = false;

  @Input()
  @HostBinding('class.show-label')
  public showLabel:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  public copyLink(input:HTMLInputElement){
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }
}
