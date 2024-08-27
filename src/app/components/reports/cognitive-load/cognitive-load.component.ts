import { Component, Input, ViewEncapsulation } from '@angular/core';
import { STROKE_COLOR } from '../constants/report-constants';
import { Range } from 'src/app/common/models/range.model';

@Component({
  selector: 'app-cognitive-load',
  templateUrl: './cognitive-load.component.html',
  styleUrls: ['./cognitive-load.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CognitiveLoadComponent {
  @Input() public data?:any;
  modalData: any = null;
  scoreDC:string = '55';
  scoreDCClass:string = STROKE_COLOR.LOW;
  scoreAC:string = '55';
  scoreACClass:string = STROKE_COLOR.LOW;

  ngOnInit(){
      this.modalData = this.data;
      console.log('this.modalData', this.modalData)
      this.modalData.data.clDisplay = this.modalData.data.cognitiveLoad ? (this.modalData.data.cognitiveLoad*100).toFixed(2) : "NA";
      if(this.modalData.data.designComplexity) {
        this.scoreDC = this.modalData.data.designComplexity;
        this.scoreDCClass = (parseFloat(this.scoreDC) < Range.DESIGNCL) ? STROKE_COLOR.LOW : (parseFloat(this.scoreDC) < Range.DESIGNCH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
        this.scoreDC = (this.modalData.data.designComplexity*100).toFixed(2);
      } else {
        this.scoreDC = "NA";
        this.scoreDCClass="NA";
      }
      if(this.modalData.data.adCopyComplexity) {
        this.scoreAC = this.modalData.data.adCopyComplexity;
        this.scoreACClass = (parseFloat(this.scoreAC) < Range.ADCOPYCL) ? STROKE_COLOR.LOW : (parseFloat(this.scoreAC) < Range.ADCOPYCH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
        this.scoreAC = (this.modalData.data.adCopyComplexity*100).toFixed(2);
      } else {
        this.scoreAC = "NA";
        this.scoreACClass = "NA";
      }
  }
}
