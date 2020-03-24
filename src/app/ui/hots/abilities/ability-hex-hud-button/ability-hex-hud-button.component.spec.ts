import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityHexHudButtonComponent } from './ability-hex-hud-button.component';

describe('AbilityHexHudButtonComponent', () => {
  let component: AbilityHexHudButtonComponent;
  let fixture: ComponentFixture<AbilityHexHudButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityHexHudButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityHexHudButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
