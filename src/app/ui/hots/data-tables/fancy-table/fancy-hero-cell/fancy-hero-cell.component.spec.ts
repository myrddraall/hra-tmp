import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyHeroCellComponent } from './fancy-hero-cell.component';

describe('FancyHeroCellComponent', () => {
  let component: FancyHeroCellComponent;
  let fixture: ComponentFixture<FancyHeroCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyHeroCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyHeroCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
