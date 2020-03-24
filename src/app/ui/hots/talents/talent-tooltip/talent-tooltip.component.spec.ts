import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentTooltipComponent } from './talent-tooltip.component';

describe('TalentTooltipComponent', () => {
  let component: TalentTooltipComponent;
  let fixture: ComponentFixture<TalentTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
