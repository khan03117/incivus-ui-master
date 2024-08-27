import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-recall-card',
  templateUrl: './recall-card.component.html',
  styleUrls: ['./recall-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RecallCardComponent {
  @Input() public isVideoReport?:boolean;
  @Input() public recallData?:any;
  @Input() public url?:string;
  peakImage: any = {};
  pitImage: any = {};
  graphData: any = {};

  constructor(){
    this.isVideoReport = false;
    this.recallData = {};
    this.url = '';
  }

  ngOnInit() {
      if( this.isVideoReport) {
        this.recallData.frames.sort(function (a:any, b:any) {
          return a.timeOffset - b.timeOffset;
        });

        let graphData = {
          graph: this.recallData.frames,
          type: "path"
        }

        this.graphData = graphData;

        this.peakImage = this.recallData.frames.filter(function (el:any) {
          return el.topFrame;
        });
        this.pitImage = this.recallData.frames.filter(function (el:any) {
          return el.bottomFrame;
        });

        this.peakImage.forEach( (el: any) => {
          el.hmImage = this.getHeatMapImage(el.timeOffset);
        });

        this.pitImage.forEach( (el: any) => {
          el.hmImage = this.getHeatMapImage(el.timeOffset);
        });

        this.peakImage.sort(function (a:any, b:any) { return a["score"] - b["score"]; });

        this.pitImage.sort(function (a:any, b:any) { return a["score"] - b["score"]; });

      } else {
        this.recallData.videoScore = this.recallData.recallScore;
      }
  }

  getHeatMapImage(timeOffset: number) {
    
    let t = "";
    this.recallData.heatMapImages.forEach( (el: any) => {
      if( el.timeOffset === timeOffset) {
        t = el.image;
      }
    });
    console.log(t);
    return t;
  }

  getPartScore(index: number) {
    if (this.recallData.videoParts.length) {
      return this.recallData.videoParts[index].partScore;
    } else {
      return 0;
    }
  }

  getChartData() {
    return {
      time: 60,
      data: this.recallData.frames,
      keys: ['Score'],
      chartType: 'areaRC',
      colors: ['#FFAE5B', '#5D6D60'],
      width: document.getElementById("chartContPH")?.offsetWidth
    };
  }
  
}
