import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpContainerComponent } from './help-container.component';

describe('HelpContainerComponent', () => {
  let component: HelpContainerComponent;
  let fixture: ComponentFixture<HelpContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpContainerComponent]
    });
    fixture = TestBed.createComponent(HelpContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
