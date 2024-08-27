import { Component, Input, ViewEncapsulation } from '@angular/core';
import { STROKE_COLOR } from '../../constants/report-constants';
import { Options } from 'ngx-slider-v2';
import { Range } from 'src/app/common/models/range.model';

interface sliderCardProps {
  title:string;
  score:number;
  type:string;
}
@Component({
  selector: 'app-color-contrast',
  templateUrl: './color-contrast.component.html',
  styleUrls: ['./color-contrast.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ColorContrastComponent {
  @Input() public data: any;
  sliderCardData : sliderCardProps[] = [{
    title:"Logo vs background:",
    score:29,
    type: "logo"
  },{
    title:"Product vs background:",
    score:52.5,
    type: "product"
  },{
    title:"Ad copy Text vs background:",
    score:75.5,
    type: "adcopy"
  }];


  ngOnInit(){
      if( this.data ) {
        this.sliderCardData[0].score = this.data.logoVsBgScore ? parseFloat(this.data.logoVsBgScore.toFixed(2)) : 0;
        this.sliderCardData[1].score = this.data.productVsBgScore ? parseFloat(this.data.productVsBgScore.toFixed(2)) : 0;
        this.sliderCardData[2].score = this.data.adCopyVsBgScore ? parseFloat(this.data.adCopyVsBgScore.toFixed(2)) : 0;
      }
  }

  sliderOptions(slider: sliderCardProps): Options {
    return {
      floor: 0,
      ceil: 100,
      step: 0.1,
      readOnly: true,
      ticksArray: [0, 30, 60, 100],
      getLegend: (value: number): string => {
        return `${value}`;
      },
      translate: (value: number): string => {
        console.log('label', value);
        let scoreClass = "";
        if( slider.type === 'logo' && value) {
          scoreClass = value < Range.LVBL ? 'low' : value < Range.LVBH ? 'medium' : 'high';  
        } else if( slider.type === 'product' && value) {
          scoreClass = value < Range.PVBL ? 'low' : value < Range.PVBH ? 'medium' : 'high';
        }else if( slider.type === 'adcopy' && value) {
            scoreClass = value < Range.ACVBL ? 'low' : value < Range.ACVBH ? 'medium' : 'high';
          }
        
        return `<div class="tooltipContiner">
                  <div class="title" style="text-transform:capitalize">${scoreClass} range</div>
                  <div class="score">score:<span class=${value ? scoreClass : ''}>${value ? value : 'NA'}</span></div>
                </div>`;
      }
    };
  }
}
