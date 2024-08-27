import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-creative',
  templateUrl: './creative.component.html',
  styleUrls: ['./creative.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreativeComponent {
  breadcrumb: any = [
    {
      name: "Help",
      link: "/help"
    },
    {
      name: "Creative",
      link: null
    },
  ]
}
