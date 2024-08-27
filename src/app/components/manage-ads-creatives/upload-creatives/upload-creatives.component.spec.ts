import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCreativesComponent } from './upload-creatives.component';

describe('UploadCreativesComponent', () => {
  let component: UploadCreativesComponent;
  let fixture: ComponentFixture<UploadCreativesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCreativesComponent]
    });
    fixture = TestBed.createComponent(UploadCreativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
