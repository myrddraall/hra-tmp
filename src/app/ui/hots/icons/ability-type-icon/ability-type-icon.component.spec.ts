import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityTypeIconComponent } from './ability-type-icon.component';

describe('AbilityTypeIconComponent', () => {
  let component: AbilityTypeIconComponent;
  let fixture: ComponentFixture<AbilityTypeIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityTypeIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
