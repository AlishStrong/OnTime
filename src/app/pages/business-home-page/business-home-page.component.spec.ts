import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHomePageComponent } from './business-home-page.component';

describe('BusinessHomePageComponent', () => {
  let component: BusinessHomePageComponent;
  let fixture: ComponentFixture<BusinessHomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessHomePageComponent]
    });
    fixture = TestBed.createComponent(BusinessHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
