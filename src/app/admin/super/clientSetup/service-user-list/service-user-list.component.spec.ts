import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUserListComponent } from './service-user-list.component';

describe('ServiceUserListComponent', () => {
  let component: ServiceUserListComponent;
  let fixture: ComponentFixture<ServiceUserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceUserListComponent]
    });
    fixture = TestBed.createComponent(ServiceUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
