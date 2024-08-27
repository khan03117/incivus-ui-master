import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCreateComponent } from './rule-create.component';

describe('RouleCreateComponent', () => {
  let component: RuleCreateComponent;
  let fixture: ComponentFixture<RuleCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleCreateComponent]
    });
    fixture = TestBed.createComponent(RuleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
