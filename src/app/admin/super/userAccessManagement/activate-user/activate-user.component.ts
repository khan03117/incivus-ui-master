import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { AppServices } from 'src/app/_services/app.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ActivateUserComponent {

  activateUserForm = new FormGroup({
    selectedStatus: new FormControl('')
  });
  userIds: any = [];
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: DynamicModalComponentService,
    private service: AppServices,
    private eventBusService: EventBusService
  ){}

  ngOnInit() {
    setTimeout( () => {
      this.userIds = this.brandService.getUserIds();
      this.activateUserForm = this.formBuilder.group({
        selectedStatus: new FormControl('active', [Validators.required])
      });
    }, 10);
  }

  update = () => {
    this.submitted = true;
    const { selectedStatus } = this.activateUserForm.value;
    if( selectedStatus === 'active') {
      this.service.activateAllUser({
        user: this.userIds
      }).subscribe({
        next: data => {
          this.eventBusService.emit(new EventData('activated', null));
          this.submitted = false;
        }
      });
    } else {
      this.service.deActivateAllUser({
        user: this.userIds
      }).subscribe({
        next: data => {
          this.eventBusService.emit(new EventData('deactivated', null));
          this.submitted = false;
        }
      });
    }
  }
}