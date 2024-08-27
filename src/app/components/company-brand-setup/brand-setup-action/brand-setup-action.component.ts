import { Component, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BRAND_SETUP_STEPS } from 'src/app/common/models/brandSetup/brandSetup.model';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { BrandSetupModalComponent } from 'src/app/common/modal/brand-setup-modal/brand-setup-modal.component';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-brand-setup-action',
  templateUrl: './brand-setup-action.component.html',
  styleUrls: ['./brand-setup-action.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BrandSetupActionComponent {

  brandDetails: any = {};
  errorMsg: string = '';
  submitted: boolean = false;
  constructor(
    private dynamicModalService: DynamicModalComponentService, 
    private modalComp: BrandSetupModalComponent,
    private appService: AppServices,
    private storage: StorageService,
    private modal: NzModalService
  ) {}
  
  productNameTags : string[] = [];
  isAddBrandDetailsVisible:boolean = false;
  addProductsForm = new FormGroup({
    productName: new FormControl<string>('', [Validators.required])
  });

  ngOnInit(): void {
    setTimeout( () => {
      this.brandDetails = this.dynamicModalService.getBrandDetails();
    }, 10);
  }

  

  handleClose = (removedTag: {}) => {
    // this.productNameTags = this.productNameTags.filter(tag => tag !== removedTag);
    this.brandDetails.productBrand = this.brandDetails.productBrand.filter ( (brandDetails:any) => {
      return brandDetails.name != removedTag
    });
    this.dynamicModalService.setBrandDetails(this.brandDetails);
    this.dynamicModalService.updateCompleteBrand(this.brandDetails);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 15;
    return isLongTag ? `${tag.slice(0, 15)}...` : tag;
  }

  closeModal = () => {
    this.modalComp.destroyModal();
  }

  // save = () => {
  //   this.submitted = true;
  //   this.errorMsg = '';
  //   let client = {
  //     id: this.dynamicModalService.getClientId(),
  //     brandDetails: this.dynamicModalService.getCompleteBD()
  //   }
  //   this.appService.updateClientBS(client).subscribe({
  //     next: data => {
  //       let clientResponse: any = data;
  //       this.submitted = false;
  //       if( clientResponse.id ) {
  //         let user = this.storage.getUser();
  //         user.client = clientResponse;
  //         this.storage.saveUser(user);
  //         this.dynamicModalService.setCompleteBD(clientResponse.brandDetails);
  //         this.modal.success({
  //           nzTitle: 'Success',
  //           nzContent: 'Information saved succesfully.',
  //           nzMaskClosable: false,
  //           nzKeyboard: false,
  //           nzOnOk: () => {}
  //         });
  //       }
  //     },
  //     error: err => {
  //       if( err.error && err.error.message) {
  //         this.errorMsg = err.error.message;
  //       } else {
  //         this.errorMsg = 'We are facing some glitches, please try again later.';
  //       }
  //       this.submitted = false;
  //     }
  //   });
  // }

  renderAddProdcuts = () => {
    this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.ADD_PRODCTS);
  }

  renderAddBrandGuildeline = () => {
    //if( this.brandDetails.productBrand.length > 0 ) {
      //this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.Add_BRAND_PRODUCT_GUIDELINE);
    // } else {
      this.dynamicModalService.setBrandGuideline({
        masterBrand: this.brandDetails.masterBrand,
        productBrand: null
      });
      this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.ADD_BRAND_GUIDELINE);
    //}
    
  }
}
