import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { STROKE_COLOR_CODE } from '../constants/report-constants';
import { Range, Recall, AdCopy, Cognitive, Attention, TextReadability, BrandCompliance, BrandRecognition, Digital, Color } from 'src/app/common/models/range.model';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ReportCardComponent {
  @Input() public title: string;
  @Input() public description: string;
  @Input() public score: string | undefined;
  @Input() public scoreDisplay: string | undefined;
  @Input() public rangeInfo?: number | string | undefined;
  @Input() public myCallback: Function;
  @Input() public showDetails?:boolean | undefined = false;
  @Input() public callbackParam?:any;
  @Input() public metric?: string;
  @Input() public videoReport?:boolean | undefined = false;
  @Input() public show?:boolean | undefined = false;


  strokeColor:string = '';
  noScore: boolean = false;

  constructor() { 
    this.title = '';
    this.description = '';
    this.score = '0';
    this.rangeInfo = ''
    this.myCallback = () => {};
    this.showDetails = false;
    this.callbackParam = null;
    this.metric = "";
    this.scoreDisplay = "";
    this.videoReport = false;
    this.show = true;
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if( this.score) {
     
      switch( this.metric ) {
        case "RECALL":
          this.strokeColor = (parseFloat(this.score) < Range.RECALLL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.RECALLH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.RECALLL) ? Recall.low : (parseFloat(this.score) < Range.RECALLH) ? Recall.medium : Recall.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Recall score is not available.";
          }
          break;
        case "ATTENTION":
          this.strokeColor = (parseFloat(this.score) < Range.RECALLL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.RECALLH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.RECALLL) ? Attention.low : (parseFloat(this.score) < Range.RECALLH) ? Attention.medium : Attention.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Attention score is not available.";
          }
          break;
        case "COGNITIVE":
          this.strokeColor = (parseFloat(this.score) < Range.CLL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) >= Range.CLH) ? STROKE_COLOR_CODE.LOW : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.CLL) ? Cognitive.low : (parseFloat(this.score) >= Range.CLH) ? Cognitive.high : Cognitive.medium;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Cognitive score is not available.";
          }
          break;
        case "EFFECTIVE":
          this.strokeColor = (parseFloat(this.score) < Range.ADCOPYEL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.ADCOPYEH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.ADCOPYEL) ? AdCopy.low : (parseFloat(this.score) < Range.ADCOPYEH) ? AdCopy.medium : AdCopy.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Creative effectiveness score is not available.";
          }
          break;
        case "TEXTR":
          this.strokeColor = (parseFloat(this.score) < Range.TEXTRL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.TEXTRH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.TEXTRL) ? TextReadability.low : (parseFloat(this.score) < Range.TEXTRH) ? TextReadability.medium : TextReadability.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Text readability score is not available.";
          }
          break;
        case "BRANDC":
          this.strokeColor = (parseFloat(this.score) < Range.BCL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.BCH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.BCL) ? BrandCompliance.low : (parseFloat(this.score) < Range.BCH) ? BrandCompliance.medium : BrandCompliance.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Brand compliance score is not available. Check brand guideline setup.";
          }
          break;
        case "BRANDR":
          this.strokeColor = (parseFloat(this.score) < Range.BCL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.BCH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.BCL) ? BrandRecognition.low : (parseFloat(this.score) < Range.BCH) ? BrandRecognition.medium : BrandRecognition.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Brand recognition score is not available.";
          }
          break;
        case "EMOTION":
          this.strokeColor = (parseFloat(this.score) < Range.EIL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.EIH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Emotion score is not available.";
          }
          break;
        case "DIGITAL":
          //this.strokeColor = (parseFloat(this.score) < Range.DAL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.DAH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          //this.description = (parseFloat(this.score) < Range.DAL) ? Digital.low : (parseFloat(this.score) < Range.DAH) ? Digital.medium : Digital.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Digital accessibility score is not available.";
          }
          break;
        case "COLOR":
          this.strokeColor = (parseFloat(this.score) < Range.CCL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.CCH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          this.description = (parseFloat(this.score) < Range.CCL) ? Color.low : (parseFloat(this.score) < Range.CCH) ? Color.medium : Color.high;
          if( this.scoreDisplay === 'NA') {
            this.description = "Uh ho! Color contrast score is not available.";
          }
          break;
        default :
          this.strokeColor = (parseFloat(this.score) < Range.DAL) ? STROKE_COLOR_CODE.LOW : (parseFloat(this.score) < Range.DAH) ? STROKE_COLOR_CODE.MEDIUM : STROKE_COLOR_CODE.HIGH;
          break;
      }
    } else {
      this.noScore = true;
    }
    
  }
}
