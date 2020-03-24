import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlowingTextComponent } from './glowing-text.component';

describe('GlowingTextComponent', () => {
  let component: GlowingTextComponent;
  let fixture: ComponentFixture<GlowingTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlowingTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlowingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
