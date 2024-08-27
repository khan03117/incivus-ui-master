import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AlertComponent {
  @Input() public message:String;
  @Input() public alertType:String;

  constructor() {
    this.message = '';
    this.alertType = '';
  }
}
