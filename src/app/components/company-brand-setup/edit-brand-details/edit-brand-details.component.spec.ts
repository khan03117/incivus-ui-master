import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrandDetailsComponent } from './edit-brand-details.component';

describe('EditBrandDetailsComponent', () => {
  let component: EditBrandDetailsComponent;
  let fixture: ComponentFixture<EditBrandDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBrandDetailsComponent]
    });
    fixture = TestBed.createComponent(EditBrandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
