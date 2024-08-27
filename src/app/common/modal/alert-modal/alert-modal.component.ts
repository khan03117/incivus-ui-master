import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.less']
})
export class AlertModalComponent {
  // @Input() public wrapperClass: string;
  @Input() public description?:string;
  @Input() public primaryLabel?: string;
  @Input() public secondaryLabel?: string;
  @Input() public primaryCallback?: Function;
  @Input() public secondaryCallback?: Function;
  @Input() public align?:string;

  constructor() { 
    this.description = '';
    this.primaryLabel = '';
    this.secondaryLabel = '';
    this.primaryCallback = () => {};
    this.secondaryCallback = () => {};
    this.align = 'center';
  }
}
