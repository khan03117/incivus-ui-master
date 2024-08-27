import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSetupModalComponent } from './brand-setup-modal.component';

describe('BrandSetupModalComponent', () => {
  let component: BrandSetupModalComponent;
  let fixture: ComponentFixture<BrandSetupModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandSetupModalComponent]
    });
    fixture = TestBed.createComponent(BrandSetupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
