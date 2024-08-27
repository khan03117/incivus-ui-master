import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceRequestComponent } from './view-service-request.component';

describe('ViewServiceRequestComponent', () => {
  let component: ViewServiceRequestComponent;
  let fixture: ComponentFixture<ViewServiceRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewServiceRequestComponent]
    });
    fixture = TestBed.createComponent(ViewServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
