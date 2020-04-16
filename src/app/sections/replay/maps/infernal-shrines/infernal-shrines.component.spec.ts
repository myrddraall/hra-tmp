import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfernalShrinesComponent } from './infernal-shrines.component';

describe('InfernalShrinesComponent', () => {
  let component: InfernalShrinesComponent;
  let fixture: ComponentFixture<InfernalShrinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfernalShrinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfernalShrinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
