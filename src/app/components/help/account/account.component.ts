import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent {
  breadcrumb: any = [
    {
      name: "Help",
      link: "/help"
    },
    {
      name: "Account",
      link: null
    },
  ]
}
