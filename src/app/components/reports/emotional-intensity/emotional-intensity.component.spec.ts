import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionalIntensityComponent } from './emotional-intensity.component';

describe('EmotionalIntensityComponent', () => {
  let component: EmotionalIntensityComponent;
  let fixture: ComponentFixture<EmotionalIntensityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmotionalIntensityComponent]
    });
    fixture = TestBed.createComponent(EmotionalIntensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
