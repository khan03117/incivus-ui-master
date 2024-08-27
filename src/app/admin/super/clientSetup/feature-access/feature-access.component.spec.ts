import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAccessComponent } from './feature-access.component';

describe('FeatureAccessComponent', () => {
  let component: FeatureAccessComponent;
  let fixture: ComponentFixture<FeatureAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureAccessComponent]
    });
    fixture = TestBed.createComponent(FeatureAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
