import { Component, ViewEncapsulation, Input } from '@angular/core';
import { STROKE_COLOR } from '../../constants/report-constants';
import { Range } from 'src/app/common/models/range.model';
@Component({
  selector: 'app-text-readability-card',
  templateUrl: './text-readability-card.component.html',
  styleUrls: ['./text-readability-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TextReadabilityCardComponent {
  @Input() public data?:any;
  adCopy: any = {};

  constructor(){
    this.data = {};
  }

  ngOnInit(){
      this.adCopy = this.data.adCopy;
      if(this.adCopy.wordDensity===null || this.adCopy.wordDensity===0){
        this.adCopy.wordDensity="NA";
      }
      else this.adCopy.wordDensity_cls = (parseInt(this.adCopy.wordDensity) > Range.WD) ? STROKE_COLOR.LOW : STROKE_COLOR.HIGH;
      
      if( this.adCopy.wordDensity_desc ===null) this.adCopy.wordDensity_desc ="NA"
      else this.adCopy.wordDensity_desc = (parseInt(this.adCopy.wordDensity) > Range.WD) ? "High" : "Optimal";
      
      if(this.adCopy.text_contrast_cls===null)this.adCopy.text_contrast_cls="NA"
      else this.adCopy.text_contrast_cls = (parseFloat(this.adCopy.text_contrast) < Range.TCR) ? STROKE_COLOR.LOW : STROKE_COLOR.HIGH;
      
      if(this.adCopy.text_contrast_desc ===null)this.adCopy.text_contrast_desc ="NA"
      else this.adCopy.text_contrast_desc = (parseInt(this.adCopy.text_contrast) < Range.TCR) ? "Low" : "High";
      
      if( this.adCopy.font_visibility_cls ===null) this.adCopy.font_visibility_cls ="NA"
      else this.adCopy.font_visibility_cls = (this.adCopy.font_visibility === 1) ? STROKE_COLOR.LOW : (this.adCopy.font_visibility === 2) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
  }
}
