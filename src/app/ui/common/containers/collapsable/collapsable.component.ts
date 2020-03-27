import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AnimationEvent, transition, state, query, style, animate, group } from '@angular/animations'
import { trigger } from '@angular/animations';

@Component({
  selector: 'collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('open', [
      state('true', style({})),
      state('false', style({
        width: '{{eWidth}}',
        height: '{{eHeight}}',
        overflow: 'hidden'
      }), { params: { eWidth: '*', eHeight: '*' } }),
      //opening
      transition('false => true', [
        query('.content-wrapper', [
          style({
            width: '*',
            height: '*'
          })
        ]),
        group([
          style({
            width: '{{sWidth}}',
            height: '{{sHeight}}'
          }),
          animate('{{duration}}', style({
            width: '{{eWidth}}',
            height: '{{eHeight}}'
          }))
        ], { delay: '{{delay}}' })

      ], { params: {delay: '5ms', duration: '250ms'} }),
      //close
      transition('true => false', [
        query('.content-wrapper', [
          style({
            width: '*',
            height: '*'
          })
        ]),
        group([
          style({
            width: '{{sWidth}}',
            height: '{{sHeight}}'
          }),
          animate('{{duration}}', style({
            width: '{{eWidth}}',
            height: '{{eHeight}}'
          }))
        ], { delay: '{{delay}}' })
      ], { params: {delay: '5ms', duration: '250ms'} })
    ])
  ]
})
export class CollapsableComponent implements OnInit {

  @ViewChild('container', { static: true })
  private container: ElementRef<HTMLDivElement>;

  @HostBinding('attr.opening')
  private opening: boolean = undefined;
  @HostBinding('attr.closing')
  private closing: boolean = undefined;

  @HostBinding('attr.opened')
  private opened: boolean = true;
  @HostBinding('attr.closed')
  private closed: boolean = undefined;


  @HostBinding('@open')
  private get openState() {
    const params = {
      sHeight: '*',
      eHeight: '*',
      sWidth: '*',
      eWidth: '*',
      duration: this.duration
    };
    switch (this.origin) {
      case 'top':
      case 'bottom':
        params.sHeight = this.open ? '0px' : '*'
        params.eHeight = this.open ? '*' : '0px'
        break;
      case 'top-left':
      case 'top-right':
      case 'bottom-left':
      case 'bottom-right':
        params.sHeight = this.open ? '0px' : '*'
        params.eHeight = this.open ? '*' : '0px'

        params.sWidth = this.open ? '0px' : '*'
        params.eWidth = this.open ? '*' : '0px'
        break;
      case 'left':
      case 'right':
        if (!this.open) {
          const h = this.container.nativeElement.offsetHeight;
          params.sHeight = h + 'px';
          params.eHeight = h + 'px';
        }
        params.sWidth = this.open ? '0px' : '*'
        params.eWidth = this.open ? '*' : '0px'
        break;
    }
    return {
      value: this.open,
      params
    }
  }
  @Input()
  public open: boolean = true;

  @Input()
  public duration: string = '250ms';

  @Output()
  public openChange: EventEmitter<boolean> = new EventEmitter();


  @Input()
  @HostBinding('attr.origin')
  public origin: 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right' = 'bottom';


  constructor() { }




  ngOnInit(): void {
  }

  @HostListener('@open.start', ['$event'])
  private onAnimationStart(event: AnimationEvent) {
    if (event.toState) {
      this.opening = true;
      this.closing = undefined;
      this.opened = undefined;
      this.closed = true;
    } else {
      this.opening = undefined;
      this.closing = true;
      this.opened = true;
      this.closed = undefined;
    }
  }

  @HostListener('@open.done', ['$event'])
  private onAnimationDone(event: AnimationEvent) {

    if (event.toState) {
      this.opening = undefined;
      this.closing = undefined;
      this.opened = true;
      this.closed = undefined;
    } else {
      this.opening = undefined;
      this.closing = undefined;
      this.opened = undefined;
      this.closed = true;
    }
  }
}
