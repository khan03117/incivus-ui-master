import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsListComponent } from './permissions-list.component';

describe('PermissionsListComponent', () => {
  let component: PermissionsListComponent;
  let fixture: ComponentFixture<PermissionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsListComponent]
    });
    fixture = TestBed.createComponent(PermissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
