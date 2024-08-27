import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { StorageService } from 'src/app/_services/storage.service';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { AppServices } from 'src/app/_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';

@Component({
  selector: 'app-upload-creative-modal',
  templateUrl: './upload-creative-modal.component.html',
  styleUrls: ['./upload-creative-modal.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UploadCreativeModalComponent {

  file: any = null;
  fileAccept: string = ".mp4,.avi,.wmv,.ogg,.webm,.mov,.jpg,.jpeg,.png";
  fileType: string = "any";
  errorMsg: string = '';
  actionType: string = '';
  isAnalyze: boolean = true;
  isDisplayAd: boolean = true;
  isVideoAd: boolean = true;
  displayAdLimit: number = 0;
  videoAdLimit: number = 0;

  constructor(
    private viewContainerRef: ViewContainerRef, 
    private dynamicModalService: DynamicModalComponentService,
    private storage: StorageService,
    private service: AppServices,
    private modal: NzModalService,
    private serviceBus: EventBusService 
  ) {}

  ngOnInit(){

    let user = this.storage.getUser();
    let client = user.client;
    this.isAnalyze = user.permission.isAnalyze;
    if( client ) {
      this.isDisplayAd = client.featureAccess.imageAd.isAvailable;
      this.isVideoAd = client.featureAccess.videoAd.isAvailable;
      this.displayAdLimit = client.featureAccess.imageAd.adLimit;
      this.videoAdLimit = client.featureAccess.videoAd.adLimit;
    }
    if( this.isDisplayAd && this.isVideoAd ) {
      this.fileAccept = ".mp4,.avi,.wmv,.ogg,.webm,.mov,.jpg,.jpeg,.png";
      this.fileType = "any";
    } else if( this.isVideoAd && !this.isDisplayAd) {
      this.fileAccept = ".mp4,.avi,.wmv,.ogg,.webm,.mov";
      this.fileType = "video";
    } else {
      this.fileAccept = ".jpg,.jpeg,.png";
      this.fileType = "image";
    }
  }
  
  cancel = () => {
    this.dynamicModalService.closeModal();
  }

  getFile = (file: any) => {
    this.file = file;
  }

  getFormData(analyze: string) : any {
    let campaign = this.dynamicModalService.getCampaign();
    let formData = new FormData();
    if( this.file.name.includes('jpg') || this.file.name.includes('jpeg') || this.file.name.includes('png')){
      formData.append('artifactType', 'image');
    } else {
      formData.append('artifactType', 'video');
    }
    formData.append('brand', campaign.brand.toLowerCase());
    formData.append('multipartFile', this.file);
    formData.append('analyze', analyze);
    formData.append('title', this.file.name.split('.')[0]);
    formData.append("groupName", campaign.campaignName.toLowerCase())
    formData.append("phase", "pre-flight");
    return formData;
  }

  upload = () => {
    this.errorMsg = "";
    if( !this.file) {
      this.errorMsg = "Please select an ad file to continue.";
      window.scrollTo(0,0);
      return;
    }
    this.actionType = 'upload';
    let formData = this.getFormData('false');
    this.createAd(formData);
  }

  analyze = () => {
    this.errorMsg = "";
    if( !this.file) {
      this.errorMsg = "Please select an ad file to continue.";
      window.scrollTo(0,0);
      return;
    }
    this.actionType = "analyze";
    let formData = this.getFormData('true');
    this.createAd(formData);  
  }

  createAd(formData: any): void {
    this.service.createAd(formData).subscribe({
      next: (data: any) => {
        if( data.status.toLowerCase() === 'success') {
          let content = "Creative uploaded successfully";
          if( this.actionType === 'analyze') {
            content = "We are analyzing the creative now. Check back in few minutes for the report.";
          }
          this.modal.success({
            nzTitle: 'Success',
            nzContent: content,
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
              nzKeyboard: false,
            nzOnOk: () => {
              this.serviceBus.emit(new EventData('creative_campaign_created', ""));
              this.dynamicModalService.closeModal();
            }
          });
        } else {
          this.errorMsg = "Unable to upload creative, please try again later";
          window.scrollTo(0,0);
        }
      },
      error: err => {
        if( err.error && err.error.errorCode === "QUOTA_EXCEEDED") {
          if( this.fileType === "image") {
            this.errorMsg = `You can analyze upto ${this.displayAdLimit} display Ads only.`
          } else {
            this.errorMsg = `You can analyze upto ${this.videoAdLimit} video Ads only.`
          }
        } else {
          this.errorMsg = "Unable to upload creative, please try again later";
        }
        window.scrollTo(0,0);
      }
    })
    
  }
}
