import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandRecognitionComponent } from './brand-recognition.component';

describe('BrandRecognitionContainerComponent', () => {
  let component: BrandRecognitionComponent;
  let fixture: ComponentFixture<BrandRecognitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandRecognitionComponent]
    });
    fixture = TestBed.createComponent(BrandRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
