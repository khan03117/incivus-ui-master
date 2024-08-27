import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Range, Persuasive, TextAttention, TextReadability } from 'src/app/common/models/range.model';

const STROKE_COLOR:any = {
  LOW:"low",
  MEDIUM:"medium",
  HIGH:"high",
};

@Component({
  selector: 'app-persuasiveness-card',
  templateUrl: './persuasiveness-card.component.html',
  styleUrls: ['./persuasiveness-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PersuasivenessCardComponent {
  @Input() public data?:any;
  adCopy: any = {};
  isLoading: boolean = true;
  constructor(){
    this.data = {};
  }

  ngOnInit(){
      this.adCopy = this.data.adCopy;
      if(this.adCopy.persuasive_score==null){
        this.adCopy.persuasive_score_cls="NA";
      }
      else this.adCopy.persuasive_score_cls = (parseFloat(this.adCopy.persuasive_score) === parseFloat(Range.PERL.toString())) ? STROKE_COLOR.LOW : (parseFloat(this.adCopy.persuasive_score) === parseFloat(Range.PERH.toString())) ? STROKE_COLOR.HIGH : STROKE_COLOR.MEDIUM;
      
      if(this.adCopy.persuasive_score_desc===null){
        this.adCopy.persuasive_score_desc="NA";
      }
      else this.adCopy.persuasive_score_desc = (parseFloat(this.adCopy.persuasive_score) === parseFloat(Range.PERL.toString())) ? Persuasive.low : (parseFloat(this.adCopy.persuasive_score) === parseFloat(Range.PERH.toString())) ? Persuasive.high : Persuasive.medium;
      
      if(this.adCopy.textRedability_cls===null){
        this.adCopy.textRedability_cls="NA";
      }
      else this.adCopy.textRedability_cls = (parseFloat(this.adCopy.textRedability) < Range.TEXTRL) ? STROKE_COLOR.LOW : (parseFloat(this.adCopy.textRedability) < Range.TEXTRH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
      
      if( this.adCopy.textRedability_desc===null){
        this.adCopy.textRedability_desc="NA";
      }
      else this.adCopy.textRedability_desc = (parseFloat(this.adCopy.textRedability) < Range.TEXTRL) ? TextReadability.low : (parseFloat(this.adCopy.textRedability) < Range.TEXTRH) ? TextReadability.medium : TextReadability.high;
      
      if(this.adCopy.attention_score_cls===null){
        this.adCopy.attention_score_cls="NA";
      }
      else this.adCopy.attention_score_cls = (parseFloat(this.adCopy.attention_value) < Range.ATTNL) ? STROKE_COLOR.LOW : (parseFloat(this.adCopy.attention_value) < Range.ATTNH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
      
      if(this.adCopy.attention_score_desc===null){
        this.adCopy.attention_score_desc= "NA";
      }
      this.adCopy.attention_score_desc = (parseFloat(this.adCopy.attention_value) < Range.ATTNL) ? TextAttention.low : (parseFloat(this.adCopy.attention_value) < Range.ATTNH) ? TextAttention.medium : TextAttention.high;
          

    }

  myCallback = (type:string) => {
    this.data.callBackFn(this.data.callBackParam);
  }
}
