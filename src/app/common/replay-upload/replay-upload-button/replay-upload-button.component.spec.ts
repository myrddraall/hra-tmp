import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayUploadButtonComponent } from './replay-upload-button.component';

describe('ReplayUploadButtonComponent', () => {
  let component: ReplayUploadButtonComponent;
  let fixture: ComponentFixture<ReplayUploadButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplayUploadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
