import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCopyAttentionCardComponent } from './ad-copy-attention-card.component';

describe('AdCopyAttentionCardComponent', () => {
  let component: AdCopyAttentionCardComponent;
  let fixture: ComponentFixture<AdCopyAttentionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdCopyAttentionCardComponent]
    });
    fixture = TestBed.createComponent(AdCopyAttentionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
