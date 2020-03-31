import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ResizeSensor } from 'css-element-queries'
import { Unsubscribable, fromEvent } from 'rxjs';

enum SIDES {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT
}

@Component({
  selector: 'application-frame',
  templateUrl: './application-frame.component.html',
  styleUrls: ['./application-frame.component.scss']
})
export class ApplicationFrameComponent implements AfterViewInit, OnDestroy {

  @ViewChildren('gridArea', { read: ElementRef })
  private gridAreas: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('fixed', { read: ElementRef, static: true })
  private fixedFrame: ElementRef<HTMLElement>;

  private areaSensors: ResizeSensor[] = [];

  private sizes: number[][] = [[], [], [], []];

  private elements: HTMLElement[][] = [[], [], [], []];
  private windowSizeSub: Unsubscribable;

  private animationFramRequest: number;
  constructor(
    private readonly elmRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit(): void {
    this.gridAreas.forEach(areaRef => {
      let side: SIDES = SIDES.TOP;
      if (areaRef.nativeElement.classList.contains('left')) {
        side = SIDES.LEFT;
      }
      if (areaRef.nativeElement.classList.contains('right')) {
        side = SIDES.RIGHT;
      }
      if (areaRef.nativeElement.classList.contains('bottom')) {
        side = SIDES.BOTTOM;
      }
      let isInner = 0;
      if (areaRef.nativeElement.classList.contains('inner')) {
        isInner = 1;
      }

      let isVertical = side === SIDES.TOP || side === SIDES.BOTTOM;
      this.elements[side][isInner] = areaRef.nativeElement;

      const sensor = new ResizeSensor(areaRef.nativeElement, (size) => {
        const old = this.sizes[side][isInner];
        const value = isVertical ? size.height : size.width;
        if (old !== value) {
          this.sizes[side][isInner] = value;
          this.invalidateSizes();
        }
      });
      this.areaSensors.push(sensor);
    });
    this.windowSizeSub = fromEvent(window, 'resize').subscribe(() => {
      this.invalidateSizes();
    })
  }

  private invalidateSizes() {
    // console.log('invalidateSizes', this.sizes);
    if (this.animationFramRequest === undefined) {
      this.animationFramRequest = requestAnimationFrame(() => {
        console.log('validate sizes', this.sizes);
        const elmRect = this.fixedFrame.nativeElement.getBoundingClientRect();
        this.animationFramRequest = undefined;

        const left = this.sizes[SIDES.LEFT];

        let elm = this.elements[SIDES.LEFT][1];
        let rect = elm.getBoundingClientRect();
        this.elmRef.nativeElement.style.paddingLeft = `${rect.left + rect.width}px`;

        elm = this.elements[SIDES.RIGHT][1];
        rect = elm.getBoundingClientRect();
        this.elmRef.nativeElement.style.paddingRight = `${elmRect.width - rect.left}px`;

        elm = this.elements[SIDES.TOP][1];
        rect = elm.getBoundingClientRect();
        this.elmRef.nativeElement.style.paddingTop = `${rect.top + rect.height}px`;

        elm = this.elements[SIDES.BOTTOM][1];
        rect = elm.getBoundingClientRect();
        this.elmRef.nativeElement.style.paddingBottom = `${elmRect.height - rect.top}px`;

      });

    }
  }
  ngOnDestroy() {
    for (const sensor of this.areaSensors) {
      sensor.detach();
    }
    this.windowSizeSub.unsubscribe();
  }

}
