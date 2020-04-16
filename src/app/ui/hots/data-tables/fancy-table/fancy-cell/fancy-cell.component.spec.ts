import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyCellComponent } from './fancy-cell.component';

describe('FancyCellComponent', () => {
  let component: FancyCellComponent;
  let fixture: ComponentFixture<FancyCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
