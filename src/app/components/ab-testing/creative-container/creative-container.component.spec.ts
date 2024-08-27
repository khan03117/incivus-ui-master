import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeContainerComponent } from './creative-container.component';

describe('CreativeContainerComponent', () => {
  let component: CreativeContainerComponent;
  let fixture: ComponentFixture<CreativeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeContainerComponent]
    });
    fixture = TestBed.createComponent(CreativeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
