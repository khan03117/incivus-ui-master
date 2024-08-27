import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDetails2Component } from './campaign-details-2.component';

describe('CampaignDetails2Component', () => {
  let component: CampaignDetails2Component;
  let fixture: ComponentFixture<CampaignDetails2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignDetails2Component]
    });
    fixture = TestBed.createComponent(CampaignDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
