import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SupportComponent {
  breadcrumb: any = [
    {
      name: "Help",
      link: "/help"
    },
    {
      name: "Support",
      link: null
    },
  ]
}
