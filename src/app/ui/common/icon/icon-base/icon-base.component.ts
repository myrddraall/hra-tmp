import { Component, OnInit, Input } from '@angular/core';

export abstract class IconBaseComponent {
  @Input()
  public iconUrl:string;
  public abstract get clipPath(): string;

  @Input()
  public background:string;
}
