import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseButtonBorderComponent } from './base-button-border.component';

describe('BaseButtonBorderComponent', () => {
  let component: BaseButtonBorderComponent;
  let fixture: ComponentFixture<BaseButtonBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseButtonBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseButtonBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
