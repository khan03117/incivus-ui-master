import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampaignSuccessComponent } from './create-campaign-success.component';

describe('CreateCampaignSuccessComponent', () => {
  let component: CreateCampaignSuccessComponent;
  let fixture: ComponentFixture<CreateCampaignSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCampaignSuccessComponent]
    });
    fixture = TestBed.createComponent(CreateCampaignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
