import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicTemplate]',
})
export class DynamicTemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}