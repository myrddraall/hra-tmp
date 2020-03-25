import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedRoleFilterButtonComponent } from './extended-role-filter-button.component';

describe('ExtendedRoleFilterButtonComponent', () => {
  let component: ExtendedRoleFilterButtonComponent;
  let fixture: ComponentFixture<ExtendedRoleFilterButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedRoleFilterButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedRoleFilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
