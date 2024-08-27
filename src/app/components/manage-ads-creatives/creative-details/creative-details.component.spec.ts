import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeDetailsComponent } from './creative-details.component';

describe('CreativeDetailsComponent', () => {
  let component: CreativeDetailsComponent;
  let fixture: ComponentFixture<CreativeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeDetailsComponent]
    });
    fixture = TestBed.createComponent(CreativeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
