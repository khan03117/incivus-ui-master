import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMediaAccountComponent } from './add-media-account.component';

describe('AddMediaAccountComponent', () => {
  let component: AddMediaAccountComponent;
  let fixture: ComponentFixture<AddMediaAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMediaAccountComponent]
    });
    fixture = TestBed.createComponent(AddMediaAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
