import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHudAbilitiesComponent } from './hero-hud-abilities.component';

describe('HeroHudAbilitiesComponent', () => {
  let component: HeroHudAbilitiesComponent;
  let fixture: ComponentFixture<HeroHudAbilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroHudAbilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroHudAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
