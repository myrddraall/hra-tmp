import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyHeaderCellComponent } from './fancy-header-cell.component';

describe('FancyHeaderCellComponent', () => {
  let component: FancyHeaderCellComponent;
  let fixture: ComponentFixture<FancyHeaderCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyHeaderCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyHeaderCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
