import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitiveLoadComponent } from './cognitive-load.component';

describe('CognitiveLoadComponent', () => {
  let component: CognitiveLoadComponent;
  let fixture: ComponentFixture<CognitiveLoadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CognitiveLoadComponent]
    });
    fixture = TestBed.createComponent(CognitiveLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
