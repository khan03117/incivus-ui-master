import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BRAND_SETUP_STEPS } from 'src/app/common/models/brandSetup/brandSetup.model';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-brand-products',
  templateUrl: './add-brand-products.component.html',
  styleUrls: ['./add-brand-products.component.less']
})
export class AddBrandProductsComponent {
  productNameTags : string[] = [];
  isAddBrandDetailsVisible:boolean = false;
  brandDetails: any = {};
  submitted: boolean = false;
  brandDupError: boolean = false;
  saving: boolean = false;
  errorMsg: string = '';
  saveTriggered: boolean = true;

  constructor(
    private dynamicModalService: DynamicModalComponentService,
    private appService: AppServices,
    private storage: StorageService,
    private eventBusService: EventBusService,
    private modal: NzModalService
  ){};

  ngOnInit(): void {
    setTimeout( () => {
      this.brandDetails = deepCopy(this.dynamicModalService.getBrandDetails());
    }, 10);
  }

  addProductsForm = new FormGroup({
    productName: new FormControl<string>('', [Validators.required, Validators.minLength(3)])
  });

  get f(): { [key: string]: AbstractControl } {
    return this.addProductsForm.controls;
  }

  addProductName():void {
    this.submitted = true;
    this.brandDupError = false;
    if(this.addProductsForm.controls["productName"].errors) {
      return;
    }

    const inputValue: any = this.addProductsForm.get('productName')?.value;

    let bds = this.dynamicModalService.getCompleteBD();
    bds.forEach( (brands:any) => {
      if( brands.masterBrand.name.toLowerCase() === inputValue.toLowerCase() ) {
        this.brandDupError = true;
      }
      if( brands.productBrand && brands.productBrand.length > 0) {
        brands.productBrand.forEach( (pb:any) => {
          if( pb.name.toLowerCase() === inputValue.toLowerCase() ) {
            this.brandDupError = true;
          }
        });
      }
    });
    if ( this.brandDupError ) {
      return;
    }
    this.saveTriggered = false;
    this.submitted = false;
    // this.branNameTags.push(inputValue!);
    let brand: any = {
      name: inputValue,
      id: ''
    }
    this.brandDetails.productBrand.push(brand)
    
    this.addProductsForm.patchValue({
      productName: ''
    });
    // this.addProductsForm.controls["productName"].setErrors( null );
    this.dynamicModalService.setBrandDetails(this.brandDetails);
    this.dynamicModalService.updateCompleteBrand(this.brandDetails);
    this.saveTriggered = false;
  }

  handleClose(removedTag: string): void {
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

  save() : void {
    this.saveTriggered = false;
    this.saving = true;
    this.errorMsg = '';
    let client = {
      id: this.dynamicModalService.getClientId(),
      brandDetails: this.dynamicModalService.getCompleteBD()
    }
    this.appService.updateClientBS(client).subscribe({
      next: data => {
        let clientResponse: any = data;
        if( clientResponse.id ) {
          let user = this.storage.getUser();
          user.client = clientResponse;
          this.storage.saveUser(user);
          this.dynamicModalService.setCompleteBD(clientResponse.brandDetails);
          let brand = (this.dynamicModalService.getBrandDetails()).masterBrand.name;
          let bd = clientResponse.brandDetails.filter( (brandDet: any) => {
            return brandDet.masterBrand.name === brand;
          })[0];
          this.dynamicModalService.setBrandDetails(bd);
          this.eventBusService.emit(new EventData('brand_updated',''));
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Information saved succesfully.',
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {}
          });
        }
        this.saving = false;
      },
      error: err => {
        if( err.error && err.error.message) {
          this.errorMsg =  err.error.message;
        } else {
          this.errorMsg = "We are facing some glitches, please try again later.";
        }
        this.saving = false;
      }
    });
  }

  renderEditBrandDetails = () => {
    this.save();
    if( !this.saveTriggered ) {
      this.save();
    }
    if ( !this.errorMsg ) {
      this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.EDIT_BRAND_DETAILS);
    }
  }

  saveProgress = () => {
    this.save();
    if( !this.saveTriggered ) {
      this.save();
    }
  }
}
