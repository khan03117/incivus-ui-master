import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReportsComponent } from './all-reports.component';

describe('AllReportsComponent', () => {
  let component: AllReportsComponent;
  let fixture: ComponentFixture<AllReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllReportsComponent]
    });
    fixture = TestBed.createComponent(AllReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
