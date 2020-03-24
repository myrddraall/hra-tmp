import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSquareHeroPortraitComponent } from './small-square-hero-portrait.component';

describe('SmallSquareHeroPortraitComponent', () => {
  let component: SmallSquareHeroPortraitComponent;
  let fixture: ComponentFixture<SmallSquareHeroPortraitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallSquareHeroPortraitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallSquareHeroPortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
