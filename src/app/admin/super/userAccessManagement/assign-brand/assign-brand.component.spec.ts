import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBrandComponent } from './assign-brand.component';

describe('AssignBrandComponent', () => {
  let component: AssignBrandComponent;
  let fixture: ComponentFixture<AssignBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignBrandComponent]
    });
    fixture = TestBed.createComponent(AssignBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
