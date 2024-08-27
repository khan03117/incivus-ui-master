import { Component, ComponentRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { AlertModalComponent } from 'src/app/common/modal/alert-modal/alert-modal.component';
import { CreateCampaignSuccessComponent } from '../create-campaign-success/create-campaign-success.component';

@Component({
  selector: 'app-upload-creatives',
  templateUrl: './upload-creatives.component.html',
  styleUrls: ['./upload-creatives.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UploadCreativesComponent {
  fileAccept: string = ".jpg,.jpeg,.png";
  fileType: string = "image";
  infoMsg:string = "You can also upload multiple versions of the same Ad to analyze and compare.";
  errorMsg:string = "";
  file: any = null;
  brands: any = [];
  actionType: string = '';
  isAnalyze: boolean = false;
  isDisplayAd: boolean = true;
  isVideoAd: boolean = true;
  displayAdLimit: number = 0;
  videoAdLimit: number = 0;
  breadcrumb: any = [
    {
      name: "Creatives",
      link: "/creatives/pre-flight/list",
    },
    {
      name: "Upload Ads",
      link: null
    },
  ]


  constructor(
    private viewContainerRef: ViewContainerRef, 
    private dynamicModalService: DynamicModalComponentService,
    private storage: StorageService,
    private service: AppServices,
    private modal: NzModalService,
    private route: Router
  ) {}

  uploadCreativeForm = new FormGroup({  
    creativeName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    creativeType: new FormControl('image', [Validators.required]),
    brandName: new FormControl('', [Validators.required])
  });


  ngOnInit(){
    setTimeout( () => {
      let user = this.storage.getUser();
      this.brands = user.brands;
      let client = user.client;
      this.isAnalyze = user.permission.isAnalyze;
      if( client ) {
        this.isDisplayAd = client.featureAccess.imageAd.isAvailable;
        this.isVideoAd = client.featureAccess.videoAd.isAvailable;
        this.displayAdLimit = client.featureAccess.imageAd.adLimit;
        this.videoAdLimit = client.featureAccess.videoAd.adLimit;
      }
      
      if( this.isDisplayAd ) {
        this.fileAccept = ".jpg,.jpeg,.png";
        this.fileType = "image";
      } else {
        this.fileAccept = ".mp4,.avi,.wmv,.ogg,.webm,.mov";
        this.fileType = "video";
      }
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.uploadCreativeForm.controls;
  }

  

  creativeTypeChange(evt: any): void{
    if( evt === 'video') {
      this.fileAccept = ".mp4,.avi,.wmv,.ogg,.webm,.mov";
      this.fileType = "video";
    } else {
      this.fileAccept = ".jpg,.jpeg,.png";
      this.fileType = "image";
    }
  } 

  cancel = () => {
    this.route.navigate(["creatives", "pre-flight", "list"]);
  }

  closeModal = () => {
  }

  getFormData(analyze: string) : any {
    let input = this.uploadCreativeForm.value;
    let formData = new FormData();
    formData.append('artifactType', this.fileType);
    formData.append('brand', input.brandName ? input.brandName : '');
    formData.append('multipartFile', this.file);
    formData.append('analyze', analyze);
    formData.append('title', input.creativeName ? input.creativeName : '');
    formData.append('groupName', '');
    formData.append("phase", "pre-flight");
    return formData;
  }

  upload = () => {
    this.errorMsg = "";
    if( this.uploadCreativeForm.status.toLowerCase() === 'invalid' || !this.file) {
      this.errorMsg = "All fields are mandatory. Please check and try again";
      window.scrollTo(0,0);
      return;
    }
    this.actionType = 'upload';
    let formData = this.getFormData('false');
    this.createAd(formData);
  }

  uploadAnalyze = () => {
    this.errorMsg = "";
    if( this.uploadCreativeForm.status.toLowerCase() === 'invalid' || !this.file) {
      this.errorMsg = "All fields are mandatory. Please check and try again";
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
              this.route.navigate(["creatives", "pre-flight", "list"]);
            },
          });
          // this.dynamicModalService.createComponentModal('', CreateCampaignSuccessComponent, this.viewContainerRef,'', 'successModal');
          // this.dynamicModalService.updateModalCotentComponent(MODALCOMPONENT.CREATE_CAMPAIGN_SUCCESS);
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

  getFile = (file: any) => {
    this.file = file;
  }
}
