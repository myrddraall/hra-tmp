import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleButtonBorderComponent } from './circle-button-border.component';

describe('CircleButtonBorderComponent', () => {
  let component: CircleButtonBorderComponent;
  let fixture: ComponentFixture<CircleButtonBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleButtonBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleButtonBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
