import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-effectiveness-container',
  templateUrl: './effectiveness-container.component.html',
  styleUrls: ['./effectiveness-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EffectivenessContainerComponent {
  @Input() public data?:any;
  modalData : any = '';
  adCopyData : any = {};
  showPersuasiveness = true;
  showTextReadability = false;

  ngOnInit(){
      this.modalData = this.data;
      let data = {
        adCopy: this.modalData.data,
        isVideoReport: this.modalData.isVideoReport,
        callBackFn: this.switchBtnClick,
        callBackParam: "textReadability"
      }
      this.adCopyData = data;
  }

  switchBtnClick = (type:string) => {
    switch(type){
      case 'adCopyAttention':
        this.showPersuasiveness = false;
        this.showTextReadability = false;
        // this.showAdCopyAttention = true;
        break;
      case 'textReadability':
        this.showPersuasiveness = false;
        this.showTextReadability = true;
        // this.showAdCopyAttention = false;
        break;
      default:
        this.showPersuasiveness = true;
        this.showTextReadability = false;
        // this.showAdCopyAttention = false;
    }
    // this.showRecall = !this.showRecall;
  }
}
