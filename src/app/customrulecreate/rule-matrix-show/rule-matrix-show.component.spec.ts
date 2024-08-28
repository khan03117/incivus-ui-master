import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleMatrixShowComponent } from './rule-matrix-show.component';

describe('RuleMatrixShowComponent', () => {
  let component: RuleMatrixShowComponent;
  let fixture: ComponentFixture<RuleMatrixShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleMatrixShowComponent]
    });
    fixture = TestBed.createComponent(RuleMatrixShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
