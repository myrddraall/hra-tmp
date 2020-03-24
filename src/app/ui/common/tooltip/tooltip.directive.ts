import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Injector, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { TooltipPanelComponent } from './tooltip-panel/tooltip-panel.component';

@Directive({
  selector: '[hraTooltip]'
})
export class TooltipDirective {
  private _isOpen: boolean = false;
  private _overlayRef: OverlayRef;
  private _tooltipContainerRef: ComponentRef<TooltipPanelComponent>;
  @Input()
  public for: ElementRef<HTMLElement>;
  @Input('hraTooltip')
  public enabled: boolean;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly overlay: Overlay,
    private readonly resolver: ComponentFactoryResolver,
    private readonly injector: Injector
  ) {
    //  const overlayRef = overlay.create();
    //const ttRef = overlayRef.attach(new TemplatePortal(templateRef, viewContainerRef));
    //viewContainerRef.element.nativeElement.
   
    const subEnter = fromEvent(this.attachTo, 'mouseenter').subscribe(()=>{
      this.open();
    })

    const subLeave = fromEvent(this.attachTo, 'mouseleave').subscribe(()=>{
      this.close();
    })
  }

  private get attachTo(): HTMLElement {
    return this.viewContainerRef.element.nativeElement.parentElement;
  }

  public open() {
    if (!this._isOpen) {
      if (!this._overlayRef) {
        this._overlayRef = this.overlay.create({
          positionStrategy: this.overlay.position().connectedTo(new ElementRef(this.attachTo), {originX:"end", originY: "top"}, {overlayX: "start", overlayY:"top"})
        });
      }
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
