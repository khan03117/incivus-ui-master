import { Component, Input } from '@angular/core';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.less"],
})
export class BreadcrumbComponent {
  @Input() public buttonClass: string;
  @Input() public label: string;
  @Input() public myCallback: string;
  @Input() public fullBC: string;
  @Input() public labels: any = [];
  @Input() public capitalize: boolean = true;

  constructor() {
    this.buttonClass = "";
    this.label = "";
    this.myCallback = "";
    this.fullBC = "false";
    this.labels = [];
    console.log("breadcrumb", this.capitalize);
  }
}
