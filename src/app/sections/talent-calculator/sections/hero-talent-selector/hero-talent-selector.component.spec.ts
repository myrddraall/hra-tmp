import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTalentSelectorComponent } from './hero-talent-selector.component';

describe('HeroTalentSelectorComponent', () => {
  let component: HeroTalentSelectorComponent;
  let fixture: ComponentFixture<HeroTalentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroTalentSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroTalentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
