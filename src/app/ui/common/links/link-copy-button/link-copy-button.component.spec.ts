import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCopyButtonComponent } from './link-copy-button.component';

describe('LinkCopyButtonComponent', () => {
  let component: LinkCopyButtonComponent;
  let fixture: ComponentFixture<LinkCopyButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkCopyButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCopyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
