import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersuasivenessCardComponent } from './persuasiveness-card.component';

describe('PersuasivenessCardComponent', () => {
  let component: PersuasivenessCardComponent;
  let fixture: ComponentFixture<PersuasivenessCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersuasivenessCardComponent]
    });
    fixture = TestBed.createComponent(PersuasivenessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
