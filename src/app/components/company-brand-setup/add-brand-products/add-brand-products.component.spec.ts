import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandProductsComponent } from './add-brand-products.component';

describe('AddBrandProductsComponent', () => {
  let component: AddBrandProductsComponent;
  let fixture: ComponentFixture<AddBrandProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBrandProductsComponent]
    });
    fixture = TestBed.createComponent(AddBrandProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
