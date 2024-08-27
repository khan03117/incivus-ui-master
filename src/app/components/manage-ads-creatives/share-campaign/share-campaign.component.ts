import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { AppServices } from 'src/app/_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-share-campaign',
  templateUrl: './share-campaign.component.html',
  styleUrls: ['./share-campaign.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ShareCampaignComponent {

  userList: any = [];
  errorMsg: string = '';
  saving: boolean = false;
  inputData: any = {};
  shareCampaignForm = new FormGroup({  
    userIds: new FormControl([])
  });
  constructor(
    private modalService: DynamicModalComponentService,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private service: AppServices
  ){}
  
  ngOnInit(): void {
    setTimeout( () => {
      this.userList = this.modalService.getSharableUserList();
      this.shareCampaignForm = this.formBuilder.group({
        userIds: new FormControl([], [Validators.required])
      });
    }, 10);
  }

  

  continue = () => {
    this.saving = true;
    if( this.shareCampaignForm.status.toLowerCase() === 'invalid') {
      this.errorMsg = "All fields are mandatory.";
      this.saving = false;
      return;
    }
    let campaign = this.modalService.getCampaign();
    const { userIds } = this.shareCampaignForm.value;
    this.inputData = {campaignName: campaign.campaignName?.toLowerCase(), brand: campaign.brand?.toLowerCase(), userIds: userIds};
    
    this.service.shareCampaign(this.inputData).subscribe({
      next: (data: any) => {
        if(data && data.status && data.status.toLowerCase() === 'success') {
          this.modalService.closeModal();
          this.modal.success({
            nzTitle: 'Success',
            nzContent: "Campaign shared succesfully",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              
            }
          });
        } else {
          this.errorMsg = "Unable to share campagin, please try again later";
          this.saving = false;
        }
      },
      error: err => {
        this.errorMsg = "Unable to share campagin, please try again later";
        this.saving = false;
      }
    });
  }
  
}
