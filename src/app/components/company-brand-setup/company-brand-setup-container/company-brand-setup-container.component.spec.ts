import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBrandSetupContainerComponent } from './company-brand-setup-container.component';

describe('CompanyBrandSetupContainerComponent', () => {
  let component: CompanyBrandSetupContainerComponent;
  let fixture: ComponentFixture<CompanyBrandSetupContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyBrandSetupContainerComponent]
    });
    fixture = TestBed.createComponent(CompanyBrandSetupContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
