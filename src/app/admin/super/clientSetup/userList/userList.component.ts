import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AppServices } from 'src/app/_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { Subject, takeUntil } from "rxjs";

interface ItemData {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
}

@Component({
  selector: "app-user-list",
  templateUrl: "./userList.component.html",
  styleUrls: ["./userList.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent {
  @Input() public data: any;
  isAddTrialUserVisible = false;
  addUserData: any;
  isServiceRequest: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private appService: AppServices,
    private eventBusService: EventBusService,
    private modal: NzModalService
  ) {}

  toggleAddUserModal(): void {
    this.isAddTrialUserVisible = !this.isAddTrialUserVisible;
  }

  handleCancel(): void {
    this.isAddTrialUserVisible = false;
  }

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<string>();

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.listOfData = this.data.user;
      this.isServiceRequest =
        this.data?.client?.featureAccess?.serviceRequest ?? false;
    }, 10);

    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        if (action.name === "toggle_service_request") {
          // Based on "Service Request" feature turned on or off
          this.isServiceRequest = action?.value?.toggle;
        }
      });
  }

  addUser = () => {
    this.addUserData = {
      client: this.data.client,
      user: [],
    };
    this.toggleAddUserModal();
  };
  continue = () => {
    // on_trial_setup_complete
    this.eventBusService.emit(new EventData("on_trial_setup_complete", true));
  };

  editUser = () => {
    const [first] = this.setOfCheckedId;
    let user = this.listOfData.filter((e: any) => {
      return e.id === first;
    });
    this.addUserData = {
      client: this.data.client,
      user: user,
    };
    this.toggleAddUserModal();
  };

  deleteUser = () => {
    const [first] = this.setOfCheckedId;
    this.appService.deleteUser(first).subscribe({
      next: (data) => {
        this.modal.info({
          nzTitle: "Success",
          nzContent: "User deleted successfully",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnCancel: () => {
            this.eventBusService.emit(
              new EventData("user_deleted", this.data.client)
            );
          },
          nzOnOk: () => {
            this.eventBusService.emit(
              new EventData("user_deleted", this.data.client)
            );
          },
        });
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "Unable to delete client, please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log("Info OK"),
        });
      },
    });
  };
}
