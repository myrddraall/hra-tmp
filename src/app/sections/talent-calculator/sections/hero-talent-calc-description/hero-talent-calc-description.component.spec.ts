import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTalentCalcDescriptionComponent } from './hero-talent-calc-description.component';

describe('HeroTalentCalcDescriptionComponent', () => {
  let component: HeroTalentCalcDescriptionComponent;
  let fixture: ComponentFixture<HeroTalentCalcDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroTalentCalcDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroTalentCalcDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
