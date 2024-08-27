import { Component, ViewEncapsulation } from '@angular/core';
import { STROKE_COLOR } from '../../constants/report-constants';

@Component({
  selector: 'app-ad-copy-attention-card',
  templateUrl: './ad-copy-attention-card.component.html',
  styleUrls: ['./ad-copy-attention-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AdCopyAttentionCardComponent {
  score:string = '55';
  scoreClass:string = STROKE_COLOR.LOW;

  ngOnInit(){
      this.scoreClass = (parseInt(this.score) < 46) ? STROKE_COLOR.LOW : (parseInt(this.score) < 71) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
  }
}
