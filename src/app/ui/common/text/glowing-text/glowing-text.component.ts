import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'hra-glowing-text',
  templateUrl: './glowing-text.component.html',
  styleUrls: ['./glowing-text.component.scss']
})
export class GlowingTextComponent implements AfterViewInit, OnDestroy {

  @ViewChild('text', { static: true })
  public text: ElementRef<HTMLElement>;
  @ViewChild('textclone', { static: true })
  public clone: ElementRef<HTMLElement>;

  private _obs: MutationObserver;

  constructor() {

  
  }

  ngAfterViewInit(): void {
    this.clone.nativeElement.innerHTML = this.text.nativeElement.innerHTML;
    this._obs = new MutationObserver(evt => {
      this.clone.nativeElement.innerHTML = this.text.nativeElement.innerHTML;
    });

    this._obs.observe(this.text.nativeElement, { subtree: true, characterData: true });

  }

  ngOnDestroy(): void {
    this._obs.disconnect();
  }

}
