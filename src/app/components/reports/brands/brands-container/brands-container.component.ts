import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-brands-container',
  templateUrl: './brands-container.component.html',
  styleUrls: ['./brands-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BrandsContainerComponent {
  @Input() public data?:any;
  modalData : any = '';
  brandCuesData : any = {};
  showBrandCompliance = true;
  showBrandRecognition = false;
  showBRTab = false;

  ngOnInit(){
      
      this.modalData = this.data;
      let data = {
        brandCues: this.modalData.data,
        isVideoReport: this.modalData.isVideoReport,
        runTime: this.modalData.runTime
      }
      if(data.brandCues.logoAttr && data.brandCues.logoAttr.length > 0) {
        this.showBRTab = true;
      }
      console.log(this.modalData.isVideoReport)
      this.brandCuesData = data;
  }

  switchBtnClick = (type:string) => {
    switch(type){
      case 'brandCompliance':
        this.showBrandCompliance = true;
        this.showBrandRecognition = false;
        break;
      case 'brandRecognition':
        this.showBrandCompliance = false;
        this.showBrandRecognition = true;
        break;
      default:
        this.showBrandCompliance = true;
        this.showBrandRecognition = false;
    }
  }
}
