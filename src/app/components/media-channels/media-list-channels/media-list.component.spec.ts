import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAccountListComponent } from './media-list.component';

describe('MediaAccountsComponent', () => {
  let component: MediaAccountListComponent;
  let fixture: ComponentFixture<MediaAccountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediaAccountListComponent]
    });
    fixture = TestBed.createComponent(MediaAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
