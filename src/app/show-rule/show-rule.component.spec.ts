import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRuleComponent } from './show-rule.component';

describe('ShowRuleComponent', () => {
  let component: ShowRuleComponent;
  let fixture: ComponentFixture<ShowRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowRuleComponent]
    });
    fixture = TestBed.createComponent(ShowRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
