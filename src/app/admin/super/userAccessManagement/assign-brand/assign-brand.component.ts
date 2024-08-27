import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/_services/storage.service';
import { AppServices } from 'src/app/_services/app.service';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';

@Component({
  selector: 'app-assign-brand',
  templateUrl: './assign-brand.component.html',
  styleUrls: ['./assign-brand.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AssignBrandComponent {
  
  assignBrandForm = new FormGroup({
    brands: new FormControl([], [Validators.required])
  });
  brandDetails: any = [];
  submitted: boolean = false;
  suberror: boolean = false;
  userIds: any = [];
  clientId: string = '';
  isLoading: boolean = true;

  constructor(
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private appService: AppServices,
    private brandService: DynamicModalComponentService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      this.brandDetails = user.client.brandDetails;
      this.clientId = user.client.id;
      if( !this.brandDetails ) {
        this.getBrandDetails();
      } else {
        this.isLoading = false;
      }
      this.userIds = this.brandService.getUserIds();
      this.assignBrandForm = this.formBuilder.group({
        brands: new FormControl([], [Validators.required])
      });
    }, 10);
  }

  getBrandDetails(): void {
    this.appService.getClientDetails(this.clientId).subscribe({
      next: (data:any) => {
        this.brandDetails = data.client.brandDetails;
        this.isLoading = false;
      },
      error: err => {
        return [];
      }
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.assignBrandForm.controls;
  }

  update = () => {
    if(this.assignBrandForm.status.toLowerCase() === 'invalid') {
      this.suberror = true;
      return;
    }
    this.submitted = true;
    const { brands } = this.assignBrandForm.value;

    this.appService.assignBrand({
      "user": this.userIds,
      "brands": brands
    }).subscribe({
      next: data => {
        this.eventBusService.emit(new EventData('assign_brand', null));
        this.submitted = false;
      }
    })
  }
}
