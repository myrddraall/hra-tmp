import { Directive, ElementRef, HostListener, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';


enum DragState {
  NONE,
  DRAG_OUTSIDE,
  DRAG,
  BROWSING,
}

@Directive({
  selector: '[hraFileSelect]'
})
export class FileSelectDirective implements OnInit, OnDestroy {
  private static _instances: Set<FileSelectDirective> = new Set();

  private fileInput: HTMLInputElement;
  private _state: DragState = DragState.NONE;


  @Output()
  public fileChange: EventEmitter<File> = new EventEmitter();
  @Output()
  public stateChange: EventEmitter<DragState> = new EventEmitter();
  public get state(): DragState{
    return this.state;
  }

  constructor(
    private readonly elmRef: ElementRef<HTMLElement>
  ) {

  }
  public ngOnInit() {
    FileSelectDirective._instances.add(this);
    this.createFileInput();
  }
  public ngOnDestroy() {
    FileSelectDirective._instances.delete(this);
    this.fileInput.remove();
  }

  private createFileInput() {
    if (this.fileInput) {
      this.fileInput.remove();
    }
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.style.position = 'fixed';
    this.fileInput.style.top = '200vh';
    this.fileInput.tabIndex = -1;

    this.fileInput.addEventListener('change', () => {
      this.handleFilesChange();
    });
    
    /*this.fileInput.addEventListener('focus', () => {
      console.log('input focus')
    });
    this.fileInput.addEventListener('blur', () => {
      console.log('input blur')
    });*/
   
    this.elmRef.nativeElement.parentElement.insertBefore(this.fileInput, this.elmRef.nativeElement);
  }

  @HostListener('click', ['$event'])
  private onElementClicked(event: MouseEvent) {

    this.setDragState(DragState.BROWSING);
    this.fileInput.focus();
    fromEvent(this.fileInput, 'focus').pipe(first()).subscribe(()=>{
      this.setDragState(DragState.NONE);
    });
    this.fileInput.click();
  }



  @HostListener('dragenter', ['$event'])
  public handleDragEnter(event: DragEvent) {
    if (this.isFileDrag(event) && (event.srcElement === this.elmRef.nativeElement || this.elmRef.nativeElement.contains(event.srcElement as HTMLElement))) {
      this.upDragState(DragState.DRAG);
    }
  }

  @HostListener('dragleave', ['$event'])
  public handleDragLeave(event: DragEvent) {
    const srcElm: HTMLElement = event.srcElement as HTMLElement;
    const relElm: HTMLElement = event.relatedTarget as HTMLElement;
    if (!relElm || !this.elmRef.nativeElement.contains(relElm)) {

      //if (this.elmRef.nativeElement === srcElm && !this.elmRef.nativeElement.contains(relElm)) {
        this.downDragState(DragState.DRAG)
    //  }

    }
  }

  @HostListener('window:dragenter', ['$event'])
  public handleDragEnterWindow(event: DragEvent) {
    if (this.isFileDrag(event)) {
      this.upDragState(DragState.DRAG_OUTSIDE);
    }
  }

  @HostListener('window:dragleave', ['$event'])
  public handleDragLeaveWindow(event: DragEvent) {
    if (!event.relatedTarget) {
      this.downDragState(DragState.DRAG_OUTSIDE);
    }
    return true;
  }

  @HostListener('dragover', ['$event'])
  public handleDragOver(event: DragEvent) {
    if (this._state === DragState.DRAG) {
      event.dataTransfer.dropEffect = 'copy';
      event.preventDefault();
    }
  }

  @HostListener('window:dragover', ['$event'])
  public handleDragOverWindow(event: DragEvent) {
    if (!this.isOverAny) {
      event.dataTransfer.dropEffect = 'none';
      event.preventDefault();
    }
  }

  @HostListener('dragend', ['$event'])
  public handleDragEnd(event: DragEvent) {
    this.setDragState(DragState.NONE);
  }

  @HostListener('window:dragend', ['$event'])
  public handleDragEndWindow(event: DragEvent) {
    this.setDragState(DragState.NONE);
  }

  @HostListener('drop', ['$event'])
  public handleDrop(event: DragEvent) {
    if (this._state === DragState.DRAG) {
      this.fileInput.files = event.dataTransfer.files;
      this.handleFilesChange();
      return false;
    }
  }

  @HostListener('window:drop', ['$event'])
  public handleDropWindow(event: DragEvent) {
    this.setDragState(DragState.NONE);
  }



  private isFileDrag(event: DragEvent) {
    return event.dataTransfer.types.indexOf('Files') !== -1;
  }

  private get isOverAny() {
    for (const c of FileSelectDirective._instances) {
      if (c._state === DragState.DRAG) {
        return true;
      }
    }
    return false;
  }

  private handleFilesChange() {
    const fileList = this.fileInput.files;
    const file = fileList[0];
    this.fileChange.emit(file);
    this.createFileInput();
    this.setDragState(DragState.NONE);
  }

  private upDragState(state: DragState) {
    if (state > this._state) {
      return this.setDragState(state);
    }
    return false;
  }

  private downDragState(state: DragState) {
    if (state === this._state) {
      return this.setDragState(state - 1);
    }
    return false;
  }

  private setDragState(state: DragState) {
    if (this._state !== state) {
      this._state = state;
      const elm = this.elmRef.nativeElement;
      elm.classList.remove('drag-outside');
      elm.classList.remove('drag-over');
      elm.classList.remove('drag');
      switch (state) {
        case DragState.DRAG_OUTSIDE:
          elm.classList.add('drag-outside');
          elm.classList.add('drag');
          break;
        case DragState.DRAG:
          elm.classList.add('drag-over');
          elm.classList.add('drag');
          break;
      }
      console.log(state);
      this.stateChange.emit(state);
      return true;
    }
    return false;
  }
}
