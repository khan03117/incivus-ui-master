import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsContainerComponent } from './brands-container.component';

describe('BrandsContainerComponent', () => {
  let component: BrandsContainerComponent;
  let fixture: ComponentFixture<BrandsContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandsContainerComponent]
    });
    fixture = TestBed.createComponent(BrandsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
