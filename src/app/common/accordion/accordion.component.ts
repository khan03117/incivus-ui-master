import {
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
} from "@angular/core";
import { DynamicTemplateDirective } from "src/app/directive/dynamic-template.directive";

interface PanelProps {
  name: string;
  disabled?: boolean;
  isExpanded?: boolean;
  panelClick?: Function;
  componentName?: any;
  isValid?: boolean;
  data?: any;
  subTitle?: string;
}

@Component({
  selector: "app-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.less"],
})
export class AccordionComponent {
  @Input() public panel: PanelProps;
  @Input() public index: number;

  @ViewChild(DynamicTemplateDirective, { static: true })
  dynamicTemplate!: DynamicTemplateDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.panel = {
      name: "Company Setup",
    };
  }

  ngOnInit() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        this.panel.componentName
      );
    const viewContainerRef = this.dynamicTemplate.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    let componentRefInstance: any = componentRef.instance;
    componentRefInstance.data = this.panel.data;
  }
}
