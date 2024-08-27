import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFolderComponent } from './save-folder.component';

describe('SaveFolderComponent', () => {
  let component: SaveFolderComponent;
  let fixture: ComponentFixture<SaveFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveFolderComponent]
    });
    fixture = TestBed.createComponent(SaveFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
