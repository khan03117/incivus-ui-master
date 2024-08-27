import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySetupComponent } from './company-setup.component';

describe('CompanySetupComponent', () => {
  let component: CompanySetupComponent;
  let fixture: ComponentFixture<CompanySetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySetupComponent]
    });
    fixture = TestBed.createComponent(CompanySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
