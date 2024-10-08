import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPermissionsComponent } from './assign-permissions.component';

describe('AssignPermissionsComponent', () => {
  let component: AssignPermissionsComponent;
  let fixture: ComponentFixture<AssignPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignPermissionsComponent]
    });
    fixture = TestBed.createComponent(AssignPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
