import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallContainerComponent } from './recall-container.component';

describe('RecallContainerComponent', () => {
  let component: RecallContainerComponent;
  let fixture: ComponentFixture<RecallContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecallContainerComponent]
    });
    fixture = TestBed.createComponent(RecallContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
