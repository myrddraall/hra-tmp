import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareButtonBorderComponent } from './square-button-border.component';

describe('SquareButtonBorderComponent', () => {
  let component: SquareButtonBorderComponent;
  let fixture: ComponentFixture<SquareButtonBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareButtonBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareButtonBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
