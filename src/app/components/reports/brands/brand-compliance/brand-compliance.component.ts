import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Range } from 'src/app/common/models/range.model';

@Component({
  selector: 'app-brand-compliance',
  templateUrl: './brand-compliance.component.html',
  styleUrls: ['./brand-compliance.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BrandComplianceComponent {
  @Input() public data?:any;
  brandCues: any = {};
  isVideoReport: boolean = true;
  modalData: any = {};
  adToneObj: any = [];

  constructor(){
    this.data = null;
  }
  ngOnInit(){
      this.adToneObj = [
        ["Funny","Neutral","Serious", "NA"],
        ["Casual","Neutral","Formal", "NA"],
        ["Irreverent","Neutral","Respectful", "NA"],
        ["Enthusiastic","Neutral","Matter-of-fact", "NA"]
      ];
      this.modalData = this.data;
      this.formatBrandCues(this.modalData.brandCues);
  }

  isVoiceTone(adTone: string, tone: string): boolean {
    if( adTone && tone ) {
      return adTone.toLowerCase() === tone.toLowerCase();
    }
    return false;
  }

  formatBrandCues(brandCuesData: any) {
    let finalBrandCuesData: any = {};
    finalBrandCuesData.colorAppearances = brandCuesData.colorAppearances;
    finalBrandCuesData.foregroundColor = brandCuesData.foregroundColor;
    finalBrandCuesData.backgroundColor = brandCuesData.backgroundColor;
    finalBrandCuesData.num_of_matched = brandCuesData.num_of_matched;
    finalBrandCuesData.total_colors = brandCuesData.total_colors;
    if( brandCuesData.colorContrast && brandCuesData.colorContrast.toLowerCase() !== "na") {
      if( brandCuesData.colorContrast >= Range.CCH) {
        finalBrandCuesData.colorContrast = "High";
      } else if ( brandCuesData.colorContrast < Range.CCL ) {
        finalBrandCuesData.colorContrast = "Low";
      } else {
        finalBrandCuesData.colorContrast = "Medium";
      }
    } else {
      finalBrandCuesData.colorContrast = "NA";
    }

    finalBrandCuesData.brandCompScr = brandCuesData.brand_compliance ? brandCuesData.brand_compliance.toFixed(2) : 'NA';


    let logoAttrFormated: any = [];
    if( null != brandCuesData.logoAttr && brandCuesData.logoAttr.length) {
      
      brandCuesData.logoAttr.forEach( (logo:any) => {
        let logoFormated: any = {};
        
        if( logo.contrastRatio && logo.contrastRatio.toLowerCase() !== "na") {
          if( parseFloat(logo.contrastRatio) >= Range.BLCH) {
            logoFormated.contrast = "High";
          } else if ( parseFloat(logo.contrastRatio) < Range.BLCL ) {
            logoFormated.contrast = "Low";
          } else {
            logoFormated.contrast = "Medium";
          }
        } else {
          logoFormated.contrast = "NA";
        }

        if( logo.relativeSize && logo.relativeSize.toLowerCase() !== "na") {
          if( parseFloat(logo.relativeSize) >= Range.BLRSH) {
            logoFormated.relativeSize = "High";
          } else if ( parseFloat(logo.relativeSize) < Range.BLRSL ) {
            logoFormated.relativeSize = "Low";
          } else {
            logoFormated.relativeSize = "Medium";
          }
        } else {
          logoFormated.relativeSize = "NA";
        }

        logoFormated.label = logo.label;

        let firstFive = false;
        let lastFive = false;
        let middle = false;
        if( brandCuesData.timeline && brandCuesData.timeline.logo && brandCuesData.timeline.logo.length > 0 ) {
          let logoTimeline = brandCuesData.timeline.logo.filter(function (el: any) {
            return el.elementName.toLowerCase() === logo.label.toLowerCase();
          })[0];

          if( logoTimeline ) {
            let segments = logoTimeline.segmentList;
            segments.forEach((segment: any) => {
              if( parseFloat(segment.startTimeOffset) <= 5 ) {
                firstFive = true;
              } else if( parseFloat(segment.startTimeOffset) >= (this.modalData.runTime - 5) ) {
                lastFive = true;
              } else {
                middle = true;
              }
            });
          }
          logoFormated.present = this.presence(firstFive, middle, lastFive);
        }
        
        logoAttrFormated.push(logoFormated);

      });
    }

    let productAttrFormated: any = [];
    if( null != brandCuesData.productAttr && brandCuesData.productAttr.length) {
      
      brandCuesData.productAttr.forEach( (prod:any) => {
        let prodFormated: any = {};

        if( prod.contrastRatio && prod.contrastRatio.toLowerCase() !== "na") {
          if( parseFloat(prod.contrastRatio) >= Range.BPCH) {
            prodFormated.contrast = "High";
          } else if ( parseFloat(prod.contrastRatio) < Range.BPCL ) {
            prodFormated.contrast = "Low";
          } else {
            prodFormated.contrast = "Medium";
          }
        } else {
          prodFormated.contrast = "NA";
        }

        if( prod.relativeSize && prod.relativeSize.toLowerCase() !== "na") {
          if( parseFloat(prod.relativeSize) >= Range.BPRSH) {
            prodFormated.relativeSize = "High";
          } else if ( parseFloat(prod.relativeSize) < Range.BPRSL ) {
            prodFormated.relativeSize = "Low";
          } else {
            prodFormated.relativeSize = "Medium";
          }
        } else {
          prodFormated.relativeSize = "NA";
        }

        prodFormated.label = prod.label;

        let firstFive = false;
        let lastFive = false;
        let middle = false;
        if( brandCuesData.timeline && brandCuesData.timeline.productVisuals && brandCuesData.timeline.productVisuals.length > 0 ) {
          let prodTimeline = brandCuesData.timeline.productVisuals.filter(function (el: any) {
            return el.elementName.toLowerCase() === prod.label.toLowerCase();
          })[0];

          if( prodTimeline ) {
            let segments = prodTimeline.segmentList;
            segments.forEach((segment: any) => {
              if( parseFloat(segment.startTimeOffset) <= 5 ) {
                firstFive = true;
              } else if( parseFloat(segment.startTimeOffset) >= (this.modalData.runTime - 5) ) {
                lastFive = true;
              } else {
                middle = true;
              }
            });
          }
          prodFormated.present = this.presence(firstFive, middle, lastFive);
        }
        
        productAttrFormated.push(prodFormated);


      });
    }

    finalBrandCuesData.logoAttr = logoAttrFormated;
    finalBrandCuesData.productAttr = productAttrFormated;

    finalBrandCuesData.brandElement = [...logoAttrFormated, ... productAttrFormated];
    if( this.isVideoReport) {
      finalBrandCuesData.voiceTone = brandCuesData.voiceTone;
    }
    this.brandCues = finalBrandCuesData;
  }

  presence(first: boolean, middle: boolean, last: boolean): string {
    if( first && middle && last) {
      return "Found in first 5 seconds, middle and last 5 seconds of the Ad.";
    } else if( first && middle) {
      return "Found in first 5 seconds and middle of the Ad.";
    } else if( first && last) {
      return "Found in first 5 seconds and last 5 seconds of the Ad.";
    } else if( middle && last) {
      return "Found in middle and last 5 seconds of the Ad.";
    } else if(first) {
      return "Found in first 5 seconds of the Ad.";
    } else if(middle) {
      return "Found in middle of the Ad.";
    } else if(last) {
      return "Found in last 5 seconds of the Ad.";
    }
    return "";
  }

}
