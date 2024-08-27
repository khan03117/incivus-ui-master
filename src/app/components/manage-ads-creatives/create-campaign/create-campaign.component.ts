import { Component, Input, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { CreateCampaignSuccessComponent } from '../create-campaign-success/create-campaign-success.component';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { StorageService } from 'src/app/_services/storage.service';
import { AppServices } from 'src/app/_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreateCampaignComponent {

  @Input() data: any;
  user: any = {};
  brandList: any = [];
  errorMsg: string = '';
  saving: boolean = false;
  inputData: any = {};
  creativeMeta: any = {};
  campaigns: any = [];
  blurCN: boolean = false;
  submitted: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef, 
    private dynamicModalService: DynamicModalComponentService,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private service: AppServices,
    private modal: NzModalService,
    private route: Router,
    private serviceBus: EventBusService
  ){}

  createCampaignForm = new FormGroup({  
    campaignName: new FormControl(''),
    brand: new FormControl('')
  });

  ngOnInit(){
    setTimeout( () => {
      console.log("information", this.data);
      this.user = this.storage.getUser()
      if( this.data.type === 'CREATE_CAMPAIGN') {
        this.createCampaignForm = this.formBuilder.group({
          campaignName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.pattern(/^[a-zA-Z0-9]+(?:[\w -]*[a-zA-Z0-9]+)*$/)]],
          brand: ["", [Validators.required]]
        });
        this.brandList = this.user.brands;
      } else if( this.data.type === 'EDIT_CAMPAIGN') {
        this.createCampaignForm = this.formBuilder.group({
          campaignName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.pattern(/^[a-zA-Z0-9]+(?:[\w -]*[a-zA-Z0-9]+)*$/)]],
          brand: [""]
        });
      } else if ( this.data.type === 'LINK_CAMPAIGN') {
        this.creativeMeta = this.dynamicModalService.getCreativeMeta();
        let brand = this.creativeMeta.brand;
        let campagins = this.user.campaigns ? this.user.campaigns : [];
        let sharedCampaigns = this.user.sharedCampaigns ? this.user.sharedCampaigns : [];
        
        this.campaigns = [...campagins, ...sharedCampaigns].filter( (campaign: any) => {
          return campaign.brand.toLowerCase() === brand.toLowerCase();
        });
        this.createCampaignForm = this.formBuilder.group({
          campaignName: ["", [Validators.required]],
          brand: [""]
        });
      }
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createCampaignForm.controls;
  }

  
  
  cancel = () => {
    this.dynamicModalService.closeModal();
  }

  create = () => {
    this.saving = true;
    this.submitted = false;
    this.errorMsg = "";
    if( this.createCampaignForm.status.toLowerCase() === 'invalid') {
      this.blurCN = true;
      this.submitted = true;
      // this.errorMsg = "All fields are mandatory.";
      this.saving = false;
      return;
    }
    const { campaignName, brand } = this.createCampaignForm.value;
    this.inputData = {campaignName: campaignName?.toLowerCase(), brand: brand?.toLowerCase()};
    
    this.service.createCamapign(this.inputData).subscribe({
      next: (data: any) => {
        if(data && data.status && data.status.toLowerCase() === 'success') {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: "Campaign created succesfully",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.user.campaigns.push(this.inputData);
              this.storage.saveUser(this.user);
              this.serviceBus.emit(new EventData('campaign_created', ""));
              this.dynamicModalService.closeModal();
            }
          });
        } else {
          this.errorMsg = "Unable to create campagin, please try again later";
          this.saving = false;
        }
      },
      error: (err: any) => {
        if( err && err.error && err.error.status === 500) {
          this.errorMsg = "Unable to create campagin, please try again later";
          this.saving = false;
        } else if( err && err.error && 
            err.error.status && err.error.status.toLowerCase() === 'error' && 
            err.error.errorCode && err.error.errorCode === 'CAMPAIGN_EXIST') {
              this.errorMsg = "Uh! Oh! seems like a campaign with this name already exists. Please enter a different campaign name and try again.";
              this.saving = false;
        } else {
          this.errorMsg = "Unable to create campagin, please try again later";
          this.saving = false;
        }
      }
    });
  }

  link = () => {
    this.saving = true;
    if( this.createCampaignForm.status.toLowerCase() === 'invalid') {
      this.errorMsg = "All fields are mandatory.";
      this.saving = false;
      return;
    }
    this.errorMsg = "";
    const { campaignName } = this.createCampaignForm.value;
    this.inputData = {campaignName: campaignName?.toLowerCase(), artifactId: this.creativeMeta.id};
    this.service.assignCampaign(this.inputData).subscribe({
      next: (data:any) => {
        if(data && data.status && data.status.toLowerCase() === "success") {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: "Creative linked to campaign succesfully",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.serviceBus.emit(new EventData('campaign_linked', ""));
          this.dynamicModalService.closeModal();
            }
          });
          
        } else {
          this.errorMsg = "Unable to link creatives to campagin, please try again later";
          this.saving = false;
        }
      },
      error: err => {
        this.errorMsg = "Unable to link creatives to campagin, please try again later";
          this.saving = false;
      }
    });
  }

  edit = () => {
    this.saving = true;
    this.submitted = false;
    this.errorMsg = "";
    if( this.createCampaignForm.status.toLowerCase() === 'invalid') {
      this.blurCN = true;
      this.submitted = true;
      // this.errorMsg = "All fields are mandatory.";
      this.saving = false;
      return;
    }
    const { campaignName } = this.createCampaignForm.value;
    let oldCampaignName = this.dynamicModalService.getCampaignName();
    this.inputData = {campaignName: campaignName?.toLowerCase(), oldCampaignName: oldCampaignName?.toLowerCase()};
    this.service.updateCampaign(this.inputData).subscribe({
      next: (data:any) => {
        if(data && data.status && data.status.toLowerCase() === "success") {
          let campaigns = this.user.campaigns;
          campaigns.forEach( (campaign:any) => {
            if( campaign.campaignName.toLowerCase() === this.inputData.oldCampaignName ) {
              campaign.campaignName = this.inputData.campaignName;
            }
          });
          this.user.campaigns = campaigns;
          this.storage.saveUser(this.user);
          this.serviceBus.emit(new EventData('campaign_created', ""));
          this.dynamicModalService.closeModal();
        } else {
          this.errorMsg = "Unable to update campagin name, please try again later";
          this.saving = false;
        }
      },
      error: (err: any) => {
        if( err && err.error && err.error.status === 500) {
          this.errorMsg = "Unable to edit campagin, please try again later";
          this.saving = false;
        } else if( err && err.error && 
            err.error.status && err.error.status.toLowerCase() === 'error' && 
            err.error.errorCode && err.error.errorCode === 'CAMPAIGN_EXIST') {
              this.errorMsg = "Uh! Oh! seems like a campaign with this name already exists. Please enter a different campaign name and try again.";
              this.saving = false;
        } else {
          this.errorMsg = "Unable to edit campagin, please try again later";
          this.saving = false;
        }
      }
    });
  }
}
