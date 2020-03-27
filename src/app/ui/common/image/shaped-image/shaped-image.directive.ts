import { Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Bounds, Rect, isBounds } from './Rect';
import { Color } from './Color';
import chroma from 'chroma-js';
import { Color as ChromaColor } from 'chroma-js';
@Directive({
  selector: 'canvas[src]'
})
export class ShapedImageDirective implements OnInit, OnChanges {
  private _image: HTMLImageElement = new Image();
  private _clipPath: string;
  private _resolvedclipPath: Path2D;

  @Input()
  public get clipPath(): string {
    return this._clipPath;
  }
  public set clipPath(value: string) {
    if (this._clipPath !== value) {
      this._clipPath = value;
      this._resolvedclipPath = undefined;
    }
  }

  @Input()
  public imageBounds: Rect | Bounds;


  @Input()
  public tint: Color;

  @Input('background')
  public background: Color;

  @Input()
  public src: string;

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src) {
      this._image.src = changes.src.currentValue || '';
    } else {
      this.updateImage();
    }
  }

  public onImageLoaded(event: Event) {
    this.updateImage();
  }


  private parseValue(value: string | number, total: number, canvas: Rect<number>) {
    if (typeof value === 'number') {
      return value;
    }
    if (value.endsWith('%')) {
      return parseFloat(value) / 100 * total;
    }

    if (value.endsWith('w')) {
      return parseFloat(value) / 100 * canvas.width;
    }
    if (value.endsWith('h')) {
      return parseFloat(value) / 100 * canvas.height;
    }
    return parseFloat(value);
  }
  private getCoord(property: 'top' | 'left' | 'width' | 'height' | 'right' | 'bottom', input: Partial<Rect> | Partial<Bounds>, canvas: Rect<number>): number {
    switch (property) {
      case 'top':
        return this.parseValue(input.top, canvas.height, canvas);
      case 'left':
        return this.parseValue(input.left, canvas.width, canvas);
      case 'width':
        return this.parseValue((input as Rect).width, canvas.width, canvas);
      case 'height':
        return this.parseValue((input as Rect).height, canvas.height, canvas);
      case 'right':
        return canvas.width - this.parseValue((input as Bounds).bottom, canvas.width, canvas);
      case 'bottom':
        return canvas.height - this.parseValue((input as Bounds).bottom, canvas.height, canvas);
    }
  }

  private convertRect(input: Rect | Bounds, canvas: Rect<number>): Rect<number> {
    input = input || { top: 0, left: 0, width: '100%', height: '100%' }
    if (isBounds(input)) {

      const bounds: Bounds<number> = {
        top: this.getCoord('top', input, canvas),
        left: this.getCoord('left', input, canvas),
        bottom: this.getCoord('bottom', input, canvas),
        right: this.getCoord('right', input, canvas),
      }
      return {
        top: bounds.top,
        left: bounds.left,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
      };
    }
    return {
      top: this.getCoord('top', input, canvas),
      left: this.getCoord('left', input, canvas),
      width: this.getCoord('width', input, canvas),
      height: this.getCoord('height', input, canvas)
    };
  }

  private getColor(color: Color): ChromaColor {
    return chroma(color as any || '#00000000');
  }

  private getClipPath(canvas: Rect<number>): Path2D {
    if(!this.clipPath){
      return;
    }
   // if (this._resolvedclipPath || !this.clipPath) {
  //    return this._resolvedclipPath;
   // }
    const converted = [];
    const args = this.clipPath.split(' ');

    for (const arg of args) {
      const p = arg.split(',');
      if (p.length == 1) {
        converted.push(p[0].trim())
      } else {
        const cmp = [
          this.getCoord('left', { left: p[0] }, canvas),
          this.getCoord('top', { top: p[1] }, canvas)
        ];
        converted.push(cmp.join(','));
      }
    }

    this._resolvedclipPath = new Path2D(converted.join(' '));
    return this._resolvedclipPath;
  }

  private updateImage() {

    const canvas = this.elm.nativeElement;
    var ctx = canvas.getContext('2d');
    const canvasRect = { top: 0, left: 0, width: this._image.naturalWidth, height: this._image.naturalHeight };
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
    ctx.save();

    const path = this.getClipPath(canvasRect);
    if(path){
      ctx.clip(path);
    }

    // draw background
    ctx.fillStyle = this.getColor(this.background).hex('rgba');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgBounds = this.convertRect(this.imageBounds, canvasRect);

    ctx.drawImage(this._image, imgBounds.left, imgBounds.top, imgBounds.width, imgBounds.height);

    ctx.fillStyle = this.getColor(this.tint).hex('rgba');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    /*
        let xF = 1;
        let yF = 1;
    
        switch (this.coordinates) {
          case '%':
            xF = canvas.width / 100;
            yF = canvas.height / 100;
            break;
          case 'x%':
            xF = canvas.width / 100;
            yF = xF;
            break;
          case 'y%':
            yF = canvas.height / 100;
            xF = yF;
            break;
        }
    
        let xClip = 0;
        let yClip = 0;
        let parts = this.clipTranslate?.split(',');
        if (parts) {
          xClip = +parts[0] * xF;
          yClip = +parts[1] * yF;
        }
        let xImg = 0;
        let yImg = 0;
        parts = this.imgTranslate?.split(',');
        if (parts) {
          xImg = +parts[0] * xF;
          yImg = +parts[1] * yF;
        }
        let tx = 0;
        let ty = 0;
        parts = this.translate?.split(',');
        if (parts) {
          tx = +parts[0] * xF;
          ty = +parts[1] * yF;
        }
    
        ctx.save();
        ctx.translate(tx, ty);
    
        const path = new Path2D(this.clipPath);
    
        switch (this.clipPath) {
          default:
            if (typeof this.clipPath === 'string') {
    
              ctx.translate(xClip, yClip);
              ctx.scale(xF, yF);
              ctx.clip(path);
              ctx.scale(1 / xF, 1 / yF);
              ctx.translate(-xClip, -yClip);
            }
            break;
        }
        /*
            let insetFactor: { top?: number, bottom?: number, left?: number, right?: number } = {
              bottom: (this.inset?.bottom || 0) / 100,
              left: (this.inset?.left || 0) / 100,
              right: (this.inset?.right || 0) / 100,
              top: (this.inset?.top || 0) / 100,
            };
        
        
            let imageFactor: { top?: number, left?: number, width?: number, hight?: number } = {
              top: canvas.height *  insetFactor.top,
              left: canvas.width *  insetFactor.left,
              width: canvas.width - ,
              hight: canvas.width *  insetFactor.right,
            };
            */
    /*
        if (this.background) {
          ctx.fillStyle = this.background;
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(this._image, xImg, yImg);
        ctx.translate(-tx, -ty);
    
    
    
        if (this.tint) {
          ctx.fillStyle = this.tint;
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    
        ctx.restore();
        */
  }

  constructor(private readonly elm: ElementRef<HTMLCanvasElement>) {
    this._image.onload = event => {
      this.onImageLoaded(event);
    }
  }

}
