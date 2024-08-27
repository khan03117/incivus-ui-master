import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSetupComponent } from './clientSetup.component';

describe('ClientSetupComponent', () => {
  let component: ClientSetupComponent;
  let fixture: ComponentFixture<ClientSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSetupComponent]
    });
    fixture = TestBed.createComponent(ClientSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
