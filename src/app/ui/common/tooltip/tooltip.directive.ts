import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Injector, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { fromEvent, Unsubscribable } from 'rxjs';
import { TooltipPanelComponent } from './tooltip-panel/tooltip-panel.component';


export enum TooltipPosition {
  ABOVE = 'above',
  BELOW = 'below',
  START = 'start',
  END = 'end',
}

const TooltipPositionConnections = {
  [TooltipPosition.ABOVE]: [
    { originX: "center", originY: "top", overlayX: "center", overlayY: "bottom", offsetX: 0, offsetY: -10 },
    { originX: "center", originY: "bottom", overlayX: "center", overlayY: "top", offsetX: 0, offsetY: 10 },
    { originX: "end", originY: "top", overlayX: "start", overlayY: "top", offsetX: 10, offsetY: -1 },
    { originX: "start", originY: "top", overlayX: "end", overlayY: "top", offsetX: -10, offsetY: -1 },
  ],
  [TooltipPosition.BELOW]: [
    { originX: "center", originY: "bottom", overlayX: "center", overlayY: "top", offsetX: 0, offsetY: 10 },
    { originX: "center", originY: "top", overlayX: "center", overlayY: "bottom", offsetX: 0, offsetY: -10 },
    { originX: "end", originY: "top", overlayX: "start", overlayY: "top", offsetX: 10, offsetY: -1 },
    { originX: "start", originY: "top", overlayX: "end", overlayY: "top", offsetX: -10, offsetY: -1 },
  ],
  [TooltipPosition.START]: [
    { originX: "start", originY: "top", overlayX: "end", overlayY: "top", offsetX: -10, offsetY: -1 },
    { originX: "end", originY: "top", overlayX: "start", overlayY: "top", offsetX: 10, offsetY: -1 },
    { originX: "center", originY: "top", overlayX: "center", overlayY: "bottom", offsetX: 0, offsetY: -10 },
    { originX: "center", originY: "bottom", overlayX: "center", overlayY: "top", offsetX: 0, offsetY: 10 },
  ],
  [TooltipPosition.END]: [
    { originX: "end", originY: "top", overlayX: "start", overlayY: "top", offsetX: 10, offsetY: -1 },
    { originX: "start", originY: "top", overlayX: "end", overlayY: "top", offsetX: -10, offsetY: -1 },
    { originX: "center", originY: "top", overlayX: "center", overlayY: "bottom", offsetX: 0, offsetY: -10 },
    { originX: "center", originY: "bottom", overlayX: "center", overlayY: "top", offsetX: 0, offsetY: 10 },
  ]
}

@Directive({
  selector: '[hraTooltip]'
})
export class TooltipDirective implements OnInit, OnChanges {
  private _isOpen: boolean = false;
  private _overlayRef: OverlayRef;
  private _tooltipContainerRef: ComponentRef<TooltipPanelComponent>;
  @Input()
  public for: ElementRef<HTMLElement>;
  @Input('hraTooltip')
  public enabled: boolean;

  private eventSubs: Unsubscribable[] = [];

  @Input()
  public position: TooltipPosition = TooltipPosition.ABOVE;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly overlay: Overlay,
    private readonly resolver: ComponentFactoryResolver,
    private readonly injector: Injector
  ) {

  }
  ngOnInit(): void {
    if (this.enabled) {
      this.enableTooltip();
    } else {
      this.disableTooltip();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.enabled) {
      if (this.enabled) {
        this.enableTooltip();
      } else {
        this.disableTooltip();
      }
    }
  }


  private enableTooltip() {
    this.disableTooltip();

    this.eventSubs.push(fromEvent(this.attachTo, 'mouseenter').subscribe(() => {
      this.open();
    }));

    this.eventSubs.push(fromEvent(this.attachTo, 'mouseleave').subscribe(() => {
      this.close();
    }));
  }

  private disableTooltip() {
    for (const sub of this.eventSubs) {
      sub.unsubscribe();
    }
    this.eventSubs = [];
  }

  private get attachTo(): HTMLElement {
    return this.viewContainerRef.element.nativeElement.parentElement;
  }

  public open() {
    if (!this._isOpen) {
      if (!this._overlayRef) {
        const positionStrategy = this.overlay.position().flexibleConnectedTo(new ElementRef(this.attachTo)).withPositions(TooltipPositionConnections[this.position] as ConnectedPosition[]);
        this._overlayRef = this.overlay.create({
          positionStrategy
        });
      }
      //new ElementRef(this.attachTo), {originX:"end", originY: "top"}, {overlayX: "start", overlayY:"top"}
      this._tooltipContainerRef = this._overlayRef.attach(new ComponentPortal(TooltipPanelComponent, this.viewContainerRef, this.viewContainerRef.injector));
      this._tooltipContainerRef.instance.content = new TemplatePortal(this.templateRef, this.viewContainerRef);
      //this._tooltipContainerRef.instance
      /*const panel = new TemplatePortal();
      const t = this.resolver.resolveComponentFactory(TooltipPanelComponent);
     const tt = t.create(this.injector)
      this._overlayRef.attach(tt);
      //this._tooltipRef = this._overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
      */
      this._isOpen = true;
    }
  }

  public close() {
    if (this._isOpen) {
      if (this._tooltipContainerRef) {
        this._overlayRef.detach();
      }
      // const ttRef = this._overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
      this._isOpen = false;
    }
  }

}
