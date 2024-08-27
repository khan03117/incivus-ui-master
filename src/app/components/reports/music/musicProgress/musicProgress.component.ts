import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';

@Component({
  selector: 'app-musicProgress',
  templateUrl: './musicProgress.component.html',
  styleUrls: ['./musicProgress.component.css']
})

export class MusicProgressComponent implements OnInit {
  
  @Input() public data: any;
  @Input() color: string;
  fill: any;
  halfFill: any;

  constructor(
  ) {
    this.data = 0;
    this.color = '';
  }

  ngOnInit() {
      if(this.data) {
        this.data = (this.data*100).toFixed(2);
        this.fill = (this.data / 20 ).toFixed(2);
        this.halfFill = (this.fill - Math.floor(this.fill) ) * 100;
      }
  }
}