import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownMapComponent } from './unknown-map.component';

describe('UnknownMapComponent', () => {
  let component: UnknownMapComponent;
  let fixture: ComponentFixture<UnknownMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnknownMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnknownMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
