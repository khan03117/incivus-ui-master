import { Component, ComponentFactoryResolver, ViewChild, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { AddBrandProductsComponent } from 'src/app/components/company-brand-setup/add-brand-products/add-brand-products.component';
import { BrandSetupActionComponent } from 'src/app/components/company-brand-setup/brand-setup-action/brand-setup-action.component';
import { DynamicTemplateDirective } from 'src/app/directive/dynamic-template.directive';
import { DynamicModalComponentService } from '../../services/dyamic-modal-component.service';
import { BRAND_SETUP_STEPS, IModalData } from '../../models/brandSetup/brandSetup.model';
import { AddBrandGuidelinesComponent } from 'src/app/components/company-brand-setup/add-brand-guidelines/add-brand-guidelines.component';
import { EditBrandDetailsComponent } from 'src/app/components/company-brand-setup/edit-brand-details/edit-brand-details.component';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-brand-setup-modal',
  templateUrl: './brand-setup-modal.component.html',
  styleUrls: ['./brand-setup-modal.component.less']
})
export class BrandSetupModalComponent {
  readonly #modal = inject(NzModalRef);
  nzModalData: IModalData = inject(NZ_MODAL_DATA);
  brandDetails: any = {};
  @ViewChild(DynamicTemplateDirective, { static: true }) dynamicTemplate!: DynamicTemplateDirective;
  private ngUnsubscribe = new Subject<void>();
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver, 
    private dynamicModalService:DynamicModalComponentService,
  ){}

  ngOnInit(){
    setTimeout( () => {
      this.brandDetails = this.dynamicModalService.getBrandDetails();
      this.renderDynamicComponent();
      this.dynamicModalService.updateModalContentInfo$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((name:any) => {
        this.updateBrandSetupModalContent(name);
      });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


renderDynamicComponent() {
  const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.nzModalData.displayComponent);
  const viewContainerRef = this.dynamicTemplate.viewContainerRef;
  viewContainerRef.clear();
  const componentRef = viewContainerRef.createComponent(componentFactory);
  let componentRefInstance: any = componentRef.instance;
  componentRefInstance.data = this.nzModalData.data;
}

  updateBrandSetupModalContent(name:string) {
    switch(name){
      case BRAND_SETUP_STEPS.ADD_PRODCTS :
        this.nzModalData = {
            title:'Add product(s)',
            displayComponent:AddBrandProductsComponent
        }
        break;
      case BRAND_SETUP_STEPS.EDIT_BRAND_DETAILS :
          this.nzModalData = {
              title:'Edit brand details',
              displayComponent:BrandSetupActionComponent
          }
          break;
      case BRAND_SETUP_STEPS.ADD_BRAND_GUIDELINE :
        this.nzModalData = {
            title:'Add brand guidelines',
            displayComponent:AddBrandGuidelinesComponent
        }
        break;
      case BRAND_SETUP_STEPS.Add_BRAND_PRODUCT_GUIDELINE :
        this.nzModalData = {
          title:'Add brand guidelines',
          displayComponent:EditBrandDetailsComponent
        }
        break;
      default:
        if( this.brandDetails.productBrand && this.brandDetails.productBrand.length ) {
          this.nzModalData = {
            title:"Edit brand details",
            displayComponent:BrandSetupActionComponent
          }
        } else {
          this.nzModalData = {
            title:"Add brand details",
            displayComponent:BrandSetupActionComponent
          }
        }
        
        break;
    }
    this.renderDynamicComponent();
  }

  destroyModal(): void {
    // this.#modal.componentInstance.destroy({ data: 'this the result data' });
    this.#modal.destroy();
  }
}
