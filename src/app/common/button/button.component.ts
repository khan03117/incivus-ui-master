import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent {
  @Input() public buttonClass: string;
  @Input() public label: string;
  @Input() public myCallback: Function;
  @Input() public loading: boolean;
  @Input() public callbackParam: any;


  constructor() { 
    this.buttonClass = '';
    this.label = '';
    this.myCallback = () => {};
    this.loading = false;
    this.callbackParam = null;
  }

  ngOnInit(): void {
  }

  handleClick(): void {
    if(this.callbackParam) {
      this.myCallback(this.callbackParam);
    } else { 
      this.myCallback();
    }
  }

}
