import { Component } from '@angular/core';
import { BRAND_SETUP_STEPS, BrandDetails } from 'src/app/common/models/brandSetup/brandSetup.model';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';

@Component({
  selector: 'app-edit-brand-details',
  templateUrl: './edit-brand-details.component.html',
  styleUrls: ['./edit-brand-details.component.less']
})

export class EditBrandDetailsComponent {
  brandDetails: any = {}
  productSelected: string = ''

  constructor(private dynamicModalService: DynamicModalComponentService) {}

  ngOnInit(): void {
    setTimeout( () => {
      this.brandDetails = this.dynamicModalService.getBrandDetails();
    }, 10);
  }

  buttonCallback = () => {
    console.log('isCompSetupCollapse');
  }

  renderEditBrandDetails = () => {
    this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.EDIT_BRAND_DETAILS);
  }

  renderAddBrandGuildeline = () => {
    let pb = null;
    if ( this.productSelected ) {
      pb = this.brandDetails.productBrand.filter( (pb: any) => {
        return pb.name === this.productSelected;
      })[0];
    }
    this.dynamicModalService.setBrandGuideline({
      masterBrand: this.brandDetails.masterBrand,
      productBrand: pb
    });
    this.dynamicModalService.updateModalCotentComponent(BRAND_SETUP_STEPS.ADD_BRAND_GUIDELINE);
  }
}
