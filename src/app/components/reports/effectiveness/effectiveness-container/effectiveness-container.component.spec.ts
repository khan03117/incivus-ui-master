import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectivenessContainerComponent } from './effectiveness-container.component';

describe('EffectivenessContainerComponent', () => {
  let component: EffectivenessContainerComponent;
  let fixture: ComponentFixture<EffectivenessContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EffectivenessContainerComponent]
    });
    fixture = TestBed.createComponent(EffectivenessContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
