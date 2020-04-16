import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCategoryButtonComponent } from './score-category-button.component';

describe('ScoreCategoryButtonComponent', () => {
  let component: ScoreCategoryButtonComponent;
  let fixture: ComponentFixture<ScoreCategoryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreCategoryButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreCategoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
