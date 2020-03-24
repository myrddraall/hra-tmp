import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapedImageComponent } from './shaped-image.component';

describe('ShapedImageComponent', () => {
  let component: ShapedImageComponent;
  let fixture: ComponentFixture<ShapedImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapedImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
