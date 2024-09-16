import { Component, OnInit } from '@angular/core';
import { RuleService } from '../_services/rule.service';
import { DynamicModalComponentService } from '../common/services/dyamic-modal-component.service';
import { AppServices } from '../_services/app.service';
import { ActivatedRoute } from '@angular/router';
interface Channel {
  id: string;
  title: string;
  selected?: boolean;
}
interface Brand {
  id: string;
  title: string;
}

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.less']
})


export class CampaignCreateComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private ruleService: RuleService,
    private appService: AppServices
  ) { }
  title: string = "";
  channelsList: Channel[] = [];
  selectedChannels: string = "";
  selectedBuget: string = "";
  selectedObjective: string = "";
  start_date: string = '';
  end_date: string = '';
  description: string = '';
  brands: string[] = [];
  selectedBrands: string = "";
  clientId: string = "";
  budgets: string[] = [];
  objectives: string[] = [];
  creativeMeta: any = {};
  respStatus: string = "";
  respMessage: string = "";
  campaignId: string | null = "";
  campaignData: any = {}
  ngOnInit() {



    this.channelsList = [
      { id: 'TIKTOK', title: 'TIKTOK' },
      { id: 'YOUTUBE', title: 'YOUTUBE' },
      { id: 'META', title: 'META' }
    ]
    let user = this.ruleService.getUser();
    let cid = this.route.snapshot.paramMap.get('id');
    this.campaignData = user.campaigns[cid ?? -1];

    this.brands = user.brands;
    this.budgets = [
      '$0 to $500', '$500 to $5000', 'Above $5000'
    ];
    this.objectives = [
      'Awareness', 'Consideration', 'Conversion'
    ];
    if (this.campaignData) {
      console.log(this.campaignData)
      this.title = this.campaignData.campaignName
      this.selectedChannels = this.campaignData.channels
      this.description = this.campaignData.description
    } else {
      console.log(this.campaignData)
    }
  }
  createCampaign() {
    let obj = {
      campaignName: this.title,
      brand: this.selectedBrands,
      channels: this.selectedChannels,
      budget: this.selectedBuget,
      objective: this.selectedObjective,
      start_date: this.start_date,
      end_date: this.end_date,
      description: this.description
    }
    this.appService.createCamapign(obj).subscribe(
      (data: any) => {
        this.respMessage = data.message;
        this.respStatus = data.status;
        window.scrollTo(0, 0)
      }
    )
  }

}
