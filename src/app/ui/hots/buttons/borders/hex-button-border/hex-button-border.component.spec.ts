import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexButtonBorderComponent } from './hex-button-border.component';

describe('HexButtonBorderComponent', () => {
  let component: HexButtonBorderComponent;
  let fixture: ComponentFixture<HexButtonBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexButtonBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexButtonBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
