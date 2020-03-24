import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchinfoBarComponent } from './matchinfo-bar.component';

describe('MatchinfoBarComponent', () => {
  let component: MatchinfoBarComponent;
  let fixture: ComponentFixture<MatchinfoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchinfoBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchinfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
