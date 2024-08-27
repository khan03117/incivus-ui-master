import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSetupActionComponent } from './brand-setup-action.component';

describe('BrandSetupActionComponent', () => {
  let component: BrandSetupActionComponent;
  let fixture: ComponentFixture<BrandSetupActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandSetupActionComponent]
    });
    fixture = TestBed.createComponent(BrandSetupActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
