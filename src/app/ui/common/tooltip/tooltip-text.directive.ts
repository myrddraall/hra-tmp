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

  @Input()
  public showMath: boolean = false;

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

    container.querySelectorAll('s').forEach(val => {
      const span = document.createElement('span');
      span.innerHTML = this.applyScaling(val.innerHTML);
      span.style.color = '#' + val.getAttribute('val');
      if (val.hasAttribute('name')) {
        span.classList.add(val.getAttribute('name'));
      }
      val.parentElement.insertBefore(span, val);
      val.remove();
    });

    container.querySelectorAll('c').forEach(val => {
      const span = document.createElement('span');
      span.innerHTML = this.applyScaling(val.innerHTML);
      const color = val.getAttribute('val');
      if (color) {
        if (color.indexOf('-') !== -1) {
          const p = color.split("-");
          span.style.color = 'transparent';
          span.style.backgroundImage = `linear-gradient(#${p[0]}, #${p[1]}) `;
          span.style.fontWeight = 'bold';
          span.classList.add('background-text-clip');
        } else {
          span.style.color = '#' + color;
        }
      }
      if (val.hasAttribute('name')) {
        span.classList.add(val.getAttribute('name'));
      }
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
    if (matches?.length === 3) {

      const base = +matches[1];
      const scale = +matches[2];
      if (base === 1 && scale === 0) {
        return '<span style="font-size:2em; position:relative; top:0.1em ">∞</span>';
      }
      const value = Math.round(base * Math.pow(1 + scale, this.level));
      if(this.showMath){
        return `${value} ( ${base} +${Math.round(scale * 100)}% per Level )`
      }
      return `${value}`;
    }
    matches = str?.match(/([\d\.]+)\+\+([\d\.]+)\+\+/);
    if (matches?.length === 3) {
      const base = +matches[1];
      const scale = +matches[2];
      const value = Math.round(base + (scale * (this.level - 1)));
      if(this.showMath){
        return `${value} ( ${base} + ${scale} per Level )`
      }
      return `${value}`;
    }
    return str;
  }

}
