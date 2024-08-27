import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextReadabilityCardComponent } from './text-readability-card.component';

describe('TextReadabilityCardComponent', () => {
  let component: TextReadabilityCardComponent;
  let fixture: ComponentFixture<TextReadabilityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextReadabilityCardComponent]
    });
    fixture = TestBed.createComponent(TextReadabilityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
