import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFrameComponent } from './application-frame.component';

describe('ApplicationFrameComponent', () => {
  let component: ApplicationFrameComponent;
  let fixture: ComponentFixture<ApplicationFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
