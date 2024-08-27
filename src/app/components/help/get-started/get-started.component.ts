import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedComponent {
  breadcrumb: any = [
    {
      name: "Help",
      link: "/help"
    },
    {
      name: "Get Started",
      link: null
    },
  ]
}
