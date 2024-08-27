import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCreativeModalComponent } from './upload-creative-modal.component';

describe('UploadCreativeModalComponent', () => {
  let component: UploadCreativeModalComponent;
  let fixture: ComponentFixture<UploadCreativeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCreativeModalComponent]
    });
    fixture = TestBed.createComponent(UploadCreativeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
