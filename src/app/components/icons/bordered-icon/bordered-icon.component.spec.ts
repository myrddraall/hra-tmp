import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderedIconComponent } from './bordered-icon.component';

describe('BorderedIconComponent', () => {
  let component: BorderedIconComponent;
  let fixture: ComponentFixture<BorderedIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorderedIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorderedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
