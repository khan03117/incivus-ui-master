import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ColorComponent {
  @Input() public data:any;
  color: any = {};

  ngOnInit(){
      let colorData: any = {};
      if( this.data && this.data.length) {
        colorData.p1 = this.data[0] && this.data[0].colorCode ? this.data[0].colorCode : null;
        colorData.p2 = this.data[7] && this.data[7].colorCode ? this.data[7].colorCode : null;
        colorData.p3 = this.data[6] && this.data[6].colorCode ? this.data[6].colorCode : null;
        colorData.p4 = this.data[2] && this.data[2].colorCode ? this.data[2].colorCode : null;
        colorData.p5 = this.data[1] && this.data[1].colorCode ? this.data[1].colorCode : null;
        colorData.p6 = this.data[3] && this.data[3].colorCode ? this.data[3].colorCode : null;
        colorData.p7 = this.data[4] && this.data[4].colorCode ? this.data[4].colorCode : null;
        colorData.p8 = this.data[5] && this.data[5].colorCode ? this.data[5].colorCode : null;
      }
      this.color = colorData;
  }

}
