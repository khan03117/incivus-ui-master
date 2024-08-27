import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCampaignComponent } from './share-campaign.component';

describe('ShareCampaignComponent', () => {
  let component: ShareCampaignComponent;
  let fixture: ComponentFixture<ShareCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareCampaignComponent]
    });
    fixture = TestBed.createComponent(ShareCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
