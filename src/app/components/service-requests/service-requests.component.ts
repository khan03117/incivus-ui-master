import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppServices } from "src/app/_services/app.service";
import { StorageService } from "src/app/_services/storage.service";
import { CONSTANTS } from "src/app/common/constants";

@Component({
  selector: "app-service-requests",
  templateUrl: "./service-requests.component.html",
  styleUrls: ["./service-requests.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceRequestsComponent implements OnInit {
  isServiceManager: boolean = false;
  isSuperAdmin: boolean = false;
  breadcrumb: any = [];
  type: string | null;
  searchText: string = "";
  srList: any = [];
  srListFiltered: any = [];
  clientId: string = "";
  checked = false;
  indeterminate = false;
  companyName: string = "";
  setOfCheckedId = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private appService: AppServices
  ) {}

  capitalizeFirstLetter(str: string | null): string {
    if (str != null) return str.charAt(0).toUpperCase() + str.slice(1);
    return "";
  }
  ngOnInit(): void {
    // Access the query parameters from the current route snapshot
    this.route.params.subscribe((params) => {
      // Access the 'type' parameter from the query parameters
      this.type = params["type"] ?? "all";
      // You can now use 'this.type' in your component
    });

    setTimeout(() => {
      let user = this.storage.getUser();
      this.isServiceManager =
        user && user.roles.includes(CONSTANTS.ROLES.SERVICE_MANAGER) == true;
      this.isSuperAdmin =
        user && user.roles.includes(CONSTANTS.ROLES.INC_ADMIN) == true;
      this.clientId = this.isServiceManager
        ? user.serviceClient?.id
        : user.client?.id;
      this.companyName = this.isServiceManager
        ? user.serviceClient?.companyName
        : user.client?.companyName;
      this.getServiceRequestsList(this.type);
      this.refreshBreadcrumb();
    }, 10);
  }

  filter() {
    const targetValue: any[] = [];
    this.srList.forEach((value: any) => {
      if (
        this.includesSearchText(value?.srNo) ||
        this.includesSearchText(value?.client?.companyName) ||
        this.includesSearchText(
          value?.assignedTo?.firstName + " " + value?.assignedTo?.lastName
        )
      ) {
        targetValue.push(value);
      }
    });
    this.srListFiltered = targetValue;
  }

  includesSearchText = (str: string) =>
    str?.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase());

  onAllChecked(value: boolean): void {
    this.srList.forEach((item: any) => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
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
  refreshCheckedStatus(): void {
    this.checked = this.srList.every((item: any) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.srList.some((item: any) => this.setOfCheckedId.has(item.id)) &&
      !this.checked;
  }
  openCreatePage() {
    this.router.navigate(["client", "service-requests", "create"]);
  }
  viewServiceRequest(id: string, status: string) {
    console.log(
      "viewServiceRequest",
      id,
      status,
      !this.isServiceManager && !this.isSuperAdmin && status == "draft"
    );
    if (
      !this.isServiceManager &&
      !this.isSuperAdmin &&
      status?.toLowerCase() == "draft"
    ) {
      // clicked by user and the data is a draft record
      this.router.navigate(["client", "service-requests", id, "edit"]);
    } else this.router.navigate(["client", "service-requests", id, "view"]);
  }

  getServiceRequestsList(type: string | null): void {
    this.appService
      .getAllServiceRequests(type, this.clientId)
      .subscribe((data) => {
        let response: any = data;
        this.srList = response;
        this.searchText = "";
        this.srListFiltered = response;
      });
  }
  refreshBreadcrumb() {
    const newBreadCrumb = [
      {
        name: "Service Requests",
        link: null,
      },
      {
        name: this.isServiceManager
          ? "Task List"
          : this.capitalizeFirstLetter(this.type),
        link: null,
      },
    ];
    this.breadcrumb = newBreadCrumb;
  }
}
