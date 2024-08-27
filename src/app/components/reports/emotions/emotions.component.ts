import { Component, Input, ViewEncapsulation } from '@angular/core';
import { STROKE_COLOR } from '../constants/report-constants';

@Component({
  selector: 'app-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmotionsComponent {
  @Input() public data: any;

  ngOnInit(){

  }
}
