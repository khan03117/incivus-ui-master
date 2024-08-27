import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderViewComponent } from './folder-view.component';

describe('FolderViewComponent', () => {
  let component: FolderViewComponent;
  let fixture: ComponentFixture<FolderViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FolderViewComponent]
    });
    fixture = TestBed.createComponent(FolderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
