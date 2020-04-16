import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAwardIconComponent } from './match-award-icon.component';

describe('MatchAwardIconComponent', () => {
  let component: MatchAwardIconComponent;
  let fixture: ComponentFixture<MatchAwardIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchAwardIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchAwardIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
