import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreateComponent } from "./clientCreate.component";

describe('ClientCreateComponent', () => {
  let component: ClientCreateComponent;
  let fixture: ComponentFixture<ClientCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientCreateComponent]
    });
    fixture = TestBed.createComponent(ClientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
