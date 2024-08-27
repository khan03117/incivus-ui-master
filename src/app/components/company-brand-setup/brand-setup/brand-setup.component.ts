import { Component, ViewContainerRef, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BrandSetupActionComponent } from '../brand-setup-action/brand-setup-action.component';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { BrandSetupModalComponent } from 'src/app/common/modal/brand-setup-modal/brand-setup-modal.component';
import { IModalData } from 'src/app/common/models/brandSetup/brandSetup.model';
import { AppServices } from 'src/app/_services/app.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/_services/storage.service';
import { BRAND_SETUP_STEPS } from 'src/app/common/models/brandSetup/brandSetup.model';



interface Brand {
  name: string;
  id: string;
}

interface BrandDetail {
  masterBrand: Brand;
  productBrand : Brand[];
}

@Component({
  selector: 'app-brand-setup',
  templateUrl: './brand-setup.component.html',
  styleUrls: ['./brand-setup.component.less']
})
export class BrandSetupComponent {
  @Input() public data:any;
  eventBusSub?: Subscription;
  branNameTags : string[] = [];
  isAddBrandDetailsVisible:boolean = false;
  submitted: boolean = false;
  brandDetails: any = [];
  brandDupError: boolean = false;
  clientId: string = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private modal: NzModalService,
    private guidelineModalRef : NzModalRef,
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private appService: AppServices,
    private eventBusService: EventBusService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    setTimeout( () => {
      this.clientId = this.data.id;
      this.dynamicModalService.setClientDetails(this.data);
      this.dynamicModalService.setClientId(this.data.id);
      this.brandDetails = this.dynamicModalService.getCompleteBD();
      
      if( !this.brandDetails ) {
        this.brandDetails = [];
      }
      
      this.eventBusService.readEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(action => {
        if( action.name === "initiateSave") {
          this.save();
        } else if ( action.name === "brand_updated") {
          this.brandDetails = this.dynamicModalService.getCompleteBD();
        } else if ( action.name === "close_modal") {
          this.guidelineModalRef.close();
        }
      });

    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addBrandForm = new FormGroup({
    brandName: new FormControl<string>('', [Validators.required, Validators.minLength(3)])
  });

  get f(): { [key: string]: AbstractControl } {
    return this.addBrandForm.controls;
  }

  addBrandName():void {
    this.submitted = true;
    this.brandDupError = false;
    if(this.addBrandForm.controls["brandName"].errors) {
      return;
    }

    const inputValue: any = this.addBrandForm.get('brandName')?.value;

    this.brandDetails.forEach( (brands:any) => {
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
      this.eventBusService.emit(new EventData('brandAdded', true));
    });
    if ( this.brandDupError ) {
      return;
    }

    let brand: Brand = {
      name: inputValue,
      id: ''
    }
    this.brandDetails.push({
      masterBrand: brand,
      productBrand: []
    });

    let client = {
      id: this.dynamicModalService.getClientId(),
      brandDetails: this.brandDetails
    }
    this.appService.updateClientBS(client).subscribe({
      next: data => {
        let clientResponse: any = data;
        if( clientResponse.id ) {
          let user = this.storage.getUser();
          user.client = clientResponse;
          this.storage.saveUser(user);
          this.submitted = false;
          this.addBrandForm.patchValue({
            brandName: ''
          });
          this.dynamicModalService.setCompleteBD(clientResponse.brandDetails);
        }
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to add master brand, please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
    
  }

  handleClose(removedTag: {}): void {
    // this.branNameTags = this.branNameTags.filter(tag => tag !== removedTag);
    this.brandDetails = this.brandDetails.filter ( (brandDetails:any) => {
      brandDetails.masterBrand.name != removedTag
    })
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 15;
    return isLongTag ? `${tag.slice(0, 15)}...` : tag;
  }

  addBrandDetails(tag:string) {
    console.log("In add brand details")

    let bd = this.brandDetails.filter( (bd:any) => {
      return bd.masterBrand.name === tag
    })[0];    

    let title = 'Add brand details';

    if( !bd.productBrand ) {
      bd.productBrand = [];
    }

    if( bd.productBrand && bd.productBrand.length ) {
      title = 'Edit brand details'
    }





    this.dynamicModalService.setBrandGuideline({
      masterBrand: bd.masterBrand,
      productBrand: null
    });


   this.createComponentModal(title, BrandSetupActionComponent, tag);
   this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.ADD_BRAND_GUIDELINE);

  }

  createComponentModal(title:string, component:any, tag:string): void {
    // let crBD = this.dynamicModalService.getBrandDetails();
    // if( !crBD ) {
    //   let bd = this.brandDetails.filter( (bd:any) => {
    //     return bd.masterBrand.name === tag
    //   })[0];
  
    //   this.dynamicModalService.setBrandDetails(bd);
    // } else {
    //   if ( crBD.masterBrand.name !== tag.toLowerCase()) {
    //     let bd = this.brandDetails.filter( (bd:any) => {
    //       return bd.masterBrand.name === tag
    //     })[0];
    
    //     this.dynamicModalService.setBrandDetails(bd);
    //   } 
    // }

    let bd = this.brandDetails.filter( (bd:any) => {
      return bd.masterBrand.name.toLowerCase() === tag.toLowerCase()
    })[0];

    this.dynamicModalService.setBrandDetails(bd);
    
    this.guidelineModalRef = this.modal.create<BrandSetupModalComponent, IModalData>({
      nzTitle: title,
      nzClassName: 'feature-modal',
      nzContent: BrandSetupModalComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzData: {
        title:title,
        displayComponent:component
      },
      nzOnCancel: () => {
        
        // this.modal.confirm({
        //   nzTitle: '<i>Confirm exit</i>',
        //   nzContent: '<b>Do you really want to exit, all unsaved changes will be lost?</b>',
        //   nzOkText: 'Yes',
        //   nzClassName: 'short-modal',
        //   nzClosable: false,
        //   nzOkType: 'primary',
        //   nzOkDanger: true,
        //   nzOnOk: () => {
        //     this.guidelineModalRef.close();
        //   },
        //   nzCancelText: 'No',
        //   nzOnCancel: () => true
        // });
        // return false;
        
      },
      nzFooter:null
    });
    const instance = this.guidelineModalRef.getContentComponent();
    // this.guidelineModalRef.afterOpen.subscribe(() => {
    //   this.dynamicModalService.updateModalCotentComponent();
    // });
    // Return a result when closed
    this.guidelineModalRef.afterClose.subscribe(result => {
      // Close after changes
    });

    
  }

  handleCancel(): void {
    this.isAddBrandDetailsVisible = false;
  }

  save = () => {
    
    if ( this.brandDetails.length ) {
      let client = {
        id: this.clientId,
        brandDetails: this.brandDetails
      }
      this.appService.updateClientBS(client).subscribe({
        next: data => {
          let clientResponse: any = data;
          if( clientResponse.id ) {
            let user = this.storage.getUser();
            user.client = clientResponse;
            this.storage.saveUser(user);
            this.dynamicModalService.setCompleteBD(clientResponse.brandDetails);
            this.modal.success({
              nzTitle: 'Success',
              nzContent: "Customer setup successfully saved.",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {
                this.eventBusService.emit(new EventData('Done_Success', ""));
              }
            });
          }
        },
        error: err => {
          if( err.error && err.error.message) {
            this.eventBusService.emit(new EventData('company_form_error', err.error.message));
          } else {
            this.eventBusService.emit(new EventData('company_form_error', "We are facing some glitches, please try again later."));
          }
        }
      });
    } else {
      this.modal.error({
        nzTitle: '',
        nzContent: "Please complete the Brand Setup in order to complete the step.",
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {
        }
      });
    }
  }
}
