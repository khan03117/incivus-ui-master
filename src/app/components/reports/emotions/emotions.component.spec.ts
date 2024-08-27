import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionsComponent } from './emotions.component';

describe('EmotionsContainerComponent', () => {
  let component: EmotionsComponent;
  let fixture: ComponentFixture<EmotionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmotionsComponent]
    });
    fixture = TestBed.createComponent(EmotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
