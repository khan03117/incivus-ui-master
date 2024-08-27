import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeListComponent } from './creative-list.component';

describe('CreativeListComponent', () => {
  let component: CreativeListComponent;
  let fixture: ComponentFixture<CreativeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeListComponent]
    });
    fixture = TestBed.createComponent(CreativeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
