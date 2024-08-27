import { Component, Input, ViewEncapsulation } from '@angular/core';

interface BadgeProps{
  status?:string;
  label:string;
}

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.less'],
  encapsulation: ViewEncapsulation.None
})

export class BadgeComponent {
  @Input() public status:string;
  @Input() public label:string;
  @Input() public showTooltip?:boolean;
  @Input() public description?:string;
  badgeColor : string = '';
  constructor(){
      this.status = '';
      this.label = '';
      this.showTooltip = false;
      this.description = ''
  }

  ngOnInit(){
    switch (this.status+'') {
      case '100':
        this.badgeColor = 'success';
        break;
      case '50':
        this.badgeColor = 'error';
        break;
      case '10':
        this.badgeColor = 'warning';
        break;
      case '0':
        this.badgeColor = 'warning';
        break;
      case '90':
        this.badgeColor = 'warning';
        break;  
      default:
        this.badgeColor = '#E2E8F0';
        break
    }
  }

}
