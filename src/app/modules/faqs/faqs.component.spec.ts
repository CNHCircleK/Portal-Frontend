import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FAQsComponent } from './faqs.component';

describe('FAQsComponent', () => {
  let component: FAQsComponent;
  let fixture: ComponentFixture<FAQsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
