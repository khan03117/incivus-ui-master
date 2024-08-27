import { Component, ViewEncapsulation, Input } from '@angular/core';
import { STROKE_COLOR } from '../../constants/report-constants';
import { Range } from 'src/app/common/models/range.model';

@Component({
  selector: 'app-brand-recognition',
  templateUrl: './brand-recognition.component.html',
  styleUrls: ['./brand-recognition.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BrandRecognitionComponent {
  @Input() public data?:any;
  brandCues: any = {};
  isVideoReport: boolean = true;
  modalData: any = {};

  constructor(){
    this.data = null;
  }
  
  ngOnInit(){
      this.modalData = this.data;
      this.formatBrandCues(this.modalData.brandCues);
  }

  formatBrandCues(brandCuesData: any) {
    let finalBrandCuesData: any = {};
    finalBrandCuesData.brandCompScr = brandCuesData.brand_compliance ? brandCuesData.brand_compliance : null;
    if( null != brandCuesData.logoAttr && brandCuesData.logoAttr.length) {
      brandCuesData.logoAttr.forEach( (logo:any) => {
        logo.image = this.getImage(brandCuesData.logo, logo.label);
        logo.brandRecogLabel = logo.brandRecognition ? (parseFloat(logo.brandRecognition) < Range.BRSL) ? STROKE_COLOR.LOW : (parseFloat(logo.brandRecognition) < Range.BRSH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH : "NA";

      });
    }

    finalBrandCuesData.logoAttr = brandCuesData.logoAttr;
    this.brandCues = finalBrandCuesData;
  }

  getImage(logo: any, label: string): string {
    if( logo && logo.length > 0) {
      let logoTimeline = logo.filter(function (el: any) {
        return el.title.toLowerCase() === label.toLowerCase();
      });
      if( logoTimeline && logoTimeline.length > 0) {
        return logoTimeline[0].image;
      }
    }
    return "";
  }
}
