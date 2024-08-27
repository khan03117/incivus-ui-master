import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AppServices } from "src/app/_services/app.service";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { EventData } from "src/app/_shared/event.class";

@Component({
  selector: "app-service-user-list",
  templateUrl: "./service-user-list.component.html",
  styleUrls: ["./service-user-list.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceUserListComponent implements OnInit {
  serviceUser: any = null;
  @Input() public data: any;

  checked = false;
  indeterminate = false;
  originalData: any[] = [];
  listOfData: any[] = [];
  setOfCheckedId = new Set<String>();
  searchText: string = "";
  clientId: string = "";
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private eventBusService: EventBusService,
    private service: AppServices,
    private router: Router
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.listOfData = this.data?.serviceManagers ?? [];
      this.originalData = this.listOfData;
      this.clientId = this.data.client.id;
    }, 10);
    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        console.log("event received", action);
        if (
          action.name === "service_user_save" ||
          action.name === "service_user_update"
        ) {
          this.listOfData = action?.value ?? [];
          this.originalData = this.listOfData;
          this.eventBusService.emit(
            new EventData("service_user_count_change", this.listOfData?.length)
          );
        }
      });
  }

  onAddUserClicked() {
    // this.serviceUser = {};
    this.serviceUser = { clientId: this.data?.client?.id };
    // add_service_user
    this.eventBusService.emit(
      new EventData("add_service_user", this.serviceUser)
    );
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    // this.listOfCurrentPageData = $event;
    // this.refreshCheckedStatus();
  }
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
    this.originalData.forEach((item) => this.updateCheckedSet(item.id, value));
    console.log("onAllChecked", this.originalData, this.setOfCheckedId);

    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.originalData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.originalData.some((item) => this.setOfCheckedId.has(item.id)) &&
      !this.checked;
    console.log("onAllCrefreshCheckedStatushecked", this.setOfCheckedId);
  }
  editUser(data: any): void {
    // this.router.navigate(["client", "manage", clientId]);
    // this.serviceUser = {};
    this.serviceUser = { ...data, clientId: this.data?.client?.id };
    // add_service_user
    this.eventBusService.emit(
      new EventData("add_service_user", this.serviceUser)
    );
  }
  deleteUser(id: String): void {
    // data.clientId =
    this.service
      .deleteServiceManager(this.clientId, id)
      .subscribe((response: any) => {
        this.listOfData = response ?? [];
        this.originalData = this.listOfData;
        this.eventBusService.emit(
          new EventData("service_user_count_change", this.listOfData?.length)
        );
      });
  }
  deleteUserBulk(): void {
    var list = [...this.setOfCheckedId];
    console.log("delete;", list);
    if (list.length > 0)
      this.service
        .deleteServiceManagerBulk(this.clientId, list)
        .subscribe((response: any) => {
          this.listOfData = response ?? [];
          this.originalData = this.listOfData;
          this.eventBusService.emit(
            new EventData("service_user_count_change", this.listOfData?.length)
          );
        });
  }
  filter() {
    var filteredData = [];
    if (this.searchText === "") {
      this.listOfData = this.originalData;
    } else {
      for (let data of this.originalData) {
        if (
          data["firstName"]
            .toString()
            .toUpperCase()
            .includes(this.searchText.toUpperCase()) ||
          data["lastName"]
            .toString()
            .toUpperCase()
            .includes(this.searchText.toUpperCase())
        ) {
          filteredData.push(data);
        }
      }
      this.listOfData = filteredData;
    }
  }

  completeClicked() {
    this.router.navigate(["client", "list"]);
  }

  cancelClicked() {
    this.router.navigate(["client", "list"]);
  }
}
