import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallCardComponent } from './recall-card.component';

describe('RecallCardComponent', () => {
  let component: RecallCardComponent;
  let fixture: ComponentFixture<RecallCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecallCardComponent]
    });
    fixture = TestBed.createComponent(RecallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
