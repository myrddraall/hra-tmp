import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHudUnitComponent } from './hero-hud-unit.component';

describe('HeroHudUnitComponent', () => {
  let component: HeroHudUnitComponent;
  let fixture: ComponentFixture<HeroHudUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroHudUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroHudUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
