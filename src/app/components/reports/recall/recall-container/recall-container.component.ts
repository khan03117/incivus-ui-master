import { Component, Input, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-recall-container',
  templateUrl: './recall-container.component.html',
  styleUrls: ['./recall-container.component.less'],
  encapsulation: ViewEncapsulation.None

})
export class RecallContainerComponent {
  @Input() public data?:any;
  showRecall = true;
  modalData : any = '';
  artifactId: string = '';
  isLoading: boolean = true;
  recallData: any = {};
  showRecallFt: boolean = false;
  showAttentionFt: boolean = false;


  constructor(
    private storage: StorageService
  ){}

  ngOnInit(){
      this.modalData = this.data;
      let user = this.storage.getUser();
      if( !user.roles.includes("INCIVUS_ADMIN") && !user.roles.includes("TRIAL_USER")){
        if( this.modalData.isVideoReport) {
          if( user.client && user.client.featureAccess && user.client.featureAccess.videoAd.aiModels.recall) {
            if( user.permission && user.permission.recall ) {
              this.showRecallFt = true;
            }
          }
          if( user.client && user.client.featureAccess && user.client.featureAccess.videoAd.aiModels.attention) {
            if( user.permission && user.permission.attention ) {
              this.showAttentionFt = true;
            }
          }
        } else {
          if( user.client && user.client.featureAccess && user.client.featureAccess.imageAd.aiModels.recall) {
            if( user.permission && user.permission.recall ) {
              this.showRecallFt = true;
            }
          }
          if( user.client && user.client.featureAccess && user.client.featureAccess.imageAd.aiModels.attention) {
            if( user.permission && user.permission.attention ) {
              this.showAttentionFt = true;
            }
          }
        }
      } else {
        this.showRecallFt = true;
        this.showAttentionFt = true;
      }

      this.showRecall = this.showRecallFt
      this.isLoading = false;
  }

  switchBtnClick = () => {
    this.showRecall = !this.showRecall;
  }
}
