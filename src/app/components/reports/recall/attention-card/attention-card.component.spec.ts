import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionCardComponent } from './attention-card.component';

describe('AttentionCardComponent', () => {
  let component: AttentionCardComponent;
  let fixture: ComponentFixture<AttentionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttentionCardComponent]
    });
    fixture = TestBed.createComponent(AttentionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
