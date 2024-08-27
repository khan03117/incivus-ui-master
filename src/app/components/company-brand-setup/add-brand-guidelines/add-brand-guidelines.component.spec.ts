import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandGuidelinesComponent } from './add-brand-guidelines.component';

describe('AddBrandGuidelinesComponent', () => {
  let component: AddBrandGuidelinesComponent;
  let fixture: ComponentFixture<AddBrandGuidelinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBrandGuidelinesComponent]
    });
    fixture = TestBed.createComponent(AddBrandGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
