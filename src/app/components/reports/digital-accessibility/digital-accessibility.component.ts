import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-digital-accessibility',
  templateUrl: './digital-accessibility.component.html',
  styleUrls: ['./digital-accessibility.component.less']
})
export class DigitalAccessibilityComponent {
  @Input() public data: any;
  optimizedForColor: string = "";
  optimizedForSound: string = "";
  showDigital: boolean = true;
  checkOptimizedForsound=true;
  isVideoReport:boolean=false;

  constructor() {
    this.data = {}
  }

  ngOnInit(): void {
    console.log('digital data: ', this.data);
    console.log('sound',this.data.data.optimizedForSound);
      this.optimizedForColor = this.data.data.optimizedForColor;
      this.optimizedForSound= this.data.data.optimizedForSound;
      this.isVideoReport= this.data.isVideoReport;
      if(this.optimizedForSound==null){
        this.checkOptimizedForsound=false;
      }
  }

  switchBtnClick = () => {
    this.showDigital = !this.showDigital;
  }

}
