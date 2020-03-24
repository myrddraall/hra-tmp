import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[hraTooltipText]'
})
export class TooltipTextDirective implements OnChanges {
  private _text: string;
  @Input()
  public get hraTooltipText(): string {
    return this._text;
  }

  public set hraTooltipText(value: string) {
    this._text = value;
  }

  @Input()
  public level: number = 0;
  constructor(
    private readonly elm: ElementRef<HTMLElement>
  ) { }

  ngOnChanges() {
    this.updateText();
  }

  ngOnInit() {
    this.updateText();
  }

  public updateText() {
    if (!this._text) {
      this.elm.nativeElement.innerHTML = '';
      return;
    }
    const container = document.createElement('div');
    container.innerHTML = this._text?.replace(/<n\/>/g, '<br/>');
    console.log(this._text)

    container.querySelectorAll('s').forEach(val => {
      const span = document.createElement('span');
      span.innerHTML = this.applyScaling(val.innerHTML);
      span.style.color = '#' + val.getAttribute('val');
      span.classList.add(val.getAttribute('name'));
      val.parentElement.insertBefore(span, val);
      val.remove();
    });

    container.querySelectorAll('c').forEach(val => {
      const span = document.createElement('span');
      span.innerHTML = this.applyScaling(val.innerHTML);
      span.style.color = '#' + val.getAttribute('val');
      span.classList.add(val.getAttribute('name'));
      val.parentElement.insertBefore(span, val);
      val.remove();
    });

    container.querySelectorAll('img').forEach(val => {
      const path = val.getAttribute('path');
      switch (path) {
        case '@UI/StormTalentInTextQuestIcon':
          val.setAttribute('src', 'assets/ui/icons/storm_ui_hud_log_icon_quest_tiny.png');
          val.removeAttribute('width');
          val.removeAttribute('height')
          break;
        default:
          break;
      }
    });


    this.elm.nativeElement.innerHTML = container.innerHTML || "";
  }

  private applyScaling(str: string): string {
    let matches = str?.match(/([\d\.]+)~~([\d\.]+)~~/);
    console.log('matches', matches);
    if (matches?.length === 3) {
      const base = +matches[1];
      const scale = +matches[2];
      console.log(base, Math.pow(1 + scale, this.level));
      return "" + Math.round(base * Math.pow(1 + scale, this.level));
    }
    matches = str?.match(/([\d\.]+)\+\+([\d\.]+)\+\+/);
    if (matches?.length === 3) {
      const base = +matches[1];
      const scale = +matches[2];
      return "" + Math.round(base +  (scale * (this.level - 1)));
    }
    return str;
  }

}
