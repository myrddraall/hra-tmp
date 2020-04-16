import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentTableComponent } from './talent-table.component';

describe('TalentTableComponent', () => {
  let component: TalentTableComponent;
  let fixture: ComponentFixture<TalentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
