import { Component, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppServices } from 'src/app/_services/app.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CompanySetupComponent {
  @Input() public data:any;
  buTags : string[] = [];
  gTags  : string[] = [];
  pcTags  : string[] = [];
  csTags  : string[] = [];
  isCompSetupCollapse:boolean = true;
  entities: string[] = [];
  entityMap: any = [];
  check:boolean=false;
  entitiesCopy: string[] = [];
  size:number=0;
  companyProfileForm = new FormGroup({  
    businessUnitName: new FormControl(''),
    marketName:new FormControl(''),
    productCategoryName:new FormControl(''),
    customerSegmentName:new FormControl('')
  });

  submBU: boolean = false;
  submPC: boolean = false;
  submG: boolean = false;
  submCS: boolean = false;
  client: any = {};

  constructor(
    private appServices: AppServices,
    private eventBusService: EventBusService,
    private modal: NzModalService
  ){};

  ngOnInit(): void {
    setTimeout( () => {
      if( this.data && this.data.id ) {
        this.entities = this.data.entity;
        let entityMap = this.data.entityMap;
        this.size=this.entities.length;
        this.entitiesCopy=this.entities
        if(entityMap && entityMap.length) {
          entityMap.forEach((entity: any) => {
            if(entity.masterEntity.toLowerCase() === 'business unit') {
              this.buTags = entity.subEntity;
            }
            if(entity.masterEntity.toLowerCase() === 'product category') {
              this.pcTags = entity.subEntity;
            }
            if(entity.masterEntity.toLowerCase() === 'market') {
              this.gTags = entity.subEntity;
            }
            if(entity.masterEntity.toLowerCase() === 'customer segment') {
              this.csTags = entity.subEntity;
            }
          });
        }
        this.entityChange(this.entities);
      }
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.companyProfileForm.controls;
  }

  entityChange(value: string[]): void {
    this.entities = value;
    if( this.entities && this.entities.includes("Business Unit") ) {
      this.companyProfileForm.controls['businessUnitName'].setValidators([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]);
    } else {
      this.companyProfileForm.controls['businessUnitName'].clearValidators();
    }
    if( this.entities && this.entities.includes("Product Category") ) {
      this.companyProfileForm.controls['productCategoryName'].setValidators([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]);
    } else {
      this.companyProfileForm.controls['productCategoryName'].clearValidators();
    }
    if( this.entities && this.entities.includes("Market") ) {
      this.companyProfileForm.controls['marketName'].setValidators([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]);
    } else {
      this.companyProfileForm.controls['marketName'].clearValidators();
    }
    if( this.entities && this.entities.includes("Customer Segment") ) {
      this.companyProfileForm.controls['customerSegmentName'].setValidators([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]);
    } else {
      this.companyProfileForm.controls['customerSegmentName'].clearValidators();
    }if(this.entities.length>this.size || this.entitiesCopy.length>this.entities.length)this.check=true;
    else this.check=false;
  }
  
  addBusinessUnitTag():void {
    this.submBU = true;
    this.check=true;
    if(this.companyProfileForm.controls["businessUnitName"].errors) {
      return;
    }
    this.submBU = false;
    const inputValue = this.companyProfileForm.get('businessUnitName')?.value;
    this.buTags.push(inputValue!);
    this.companyProfileForm.patchValue({
      businessUnitName: null
    });
    this.companyProfileForm.controls["businessUnitName"].setErrors( null );
  }

  addProductCategory():void {
    this.submPC = true;
    this.check=true;
    if(this.companyProfileForm.controls["productCategoryName"].errors) {
      return;
    }
    this.submPC = false;
    const inputValue = this.companyProfileForm.get('productCategoryName')?.value;
    this.pcTags.push(inputValue!);
    this.companyProfileForm.patchValue({
      productCategoryName: ''
    });
    this.companyProfileForm.controls["productCategoryName"].setErrors( null );
  }

  addMarket(): void {
    this.submG = true;
    this.check=true;
    if(this.companyProfileForm.controls["marketName"].errors) {
      return;
    }
    this.submG = false;
    const inputValue = this.companyProfileForm.get('marketName')?.value;
    this.gTags.push(inputValue!);
    this.companyProfileForm.patchValue({
      marketName: ''
    });
    this.companyProfileForm.controls["marketName"].setErrors( null );
  }

  addCustomerSegment(): void {
    this.submG = true;
    this.check=true;
    if(this.companyProfileForm.controls["customerSegmentName"].errors) {
      return;
    }
    this.submG = false;
    const inputValue = this.companyProfileForm.get('customerSegmentName')?.value;
    this.csTags.push(inputValue!);
    this.companyProfileForm.patchValue({
      customerSegmentName: ''
    });
    this.companyProfileForm.controls["customerSegmentName"].setErrors( null );
  }

  removeBUTags(removedTag: {}): void {
    this.buTags = this.buTags.filter(tag => tag !== removedTag);
  }

  removePCTags(removedTag: {}): void {
    this.pcTags = this.pcTags.filter(tag => tag !== removedTag);
  }
  removeGTags(removedTag: {}): void {
    this.gTags = this.gTags.filter(tag => tag !== removedTag);
  }
  removeCSTags(removedTag: {}): void {
    this.csTags = this.csTags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 7;
    return isLongTag ? `${tag.slice(0, 7)}...` : tag;
  }

  save = () => {
    if( !this.validForm() ) {
      return
    }
    this.saveEntity('');
  }

  continue = () => {
    if( !this.validForm() ) {
      return
    }
    this.saveEntity('continue');
  }

  saveEntity(action: string): void {
    let client = {
      id: this.data.id,
      entity: this.entities,
      entityMap: this.entityMap
    }

    this.appServices.updateClientCS(client).subscribe({
      next: data => {
        this.client = data;
        if( action.toLowerCase() === 'continue') {
          this.toggleAccordion(this.client)
        } else {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Information saved succesfully.',
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {}
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
    })
  }

  toggleAccordion(client: any) : void {
    this.eventBusService.emit(new EventData('client_updated', client));
  }

  validForm() : Boolean {
    let valid = true;
    this.entityMap = [];
    if ( this.entities && this.entities.length) {
      this.entities.forEach(item => {
        if ( item.toLowerCase() == 'business unit') {
          if( this.buTags.length > 0 ) {
            this.entityMap.push({
              masterEntity: item,
              subEntity: this.buTags
            });
          } else {
            valid = false;
          }
        }
        if ( item.toLowerCase() == 'product category') {
          if( this.pcTags.length > 0 ) {
            this.entityMap.push({
              masterEntity: item,
              subEntity: this.pcTags
            });
          } else {
            valid = false;
          }
        }
        if ( item.toLowerCase() == 'market') {
          if( this.gTags.length > 0 ) {
            this.entityMap.push({
              masterEntity: item,
              subEntity: this.gTags
            });
          } else {
            valid = false;
          }
        }
        if ( item.toLowerCase() == 'customer segment') {
          if( this.csTags.length > 0 ) {
            this.entityMap.push({
              masterEntity: item,
              subEntity: this.csTags
            });
          } else {
            valid = false;
          }
        }
      });
    } else {
      this.entityMap = [];
    }
    return valid;
  }
}
