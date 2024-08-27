import { Component } from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { ClientCreateComponent } from "./clientCreate/clientCreate.component";
import { UserCreateComponent } from "./userCreate/userCreate.component";
import { UserListComponent } from "./userList/userList.component";
import { EventBusService } from "../../../_shared/event-bus.service";
import { AppServices } from "../../../_services/app.service";
import { ServiceUserListComponent } from "./service-user-list/service-user-list.component";

@Component({
  selector: "app-clientsetup-container",
  templateUrl: "./clientSetup.component.html",
  styleUrls: ["./clientSetup.component.less"],
})
export class ClientSetupComponent {
  addCompanyInfoPanel = {
    id: 1,
    name: "Add company information",
    disabled: false,
    isExpanded: true,
    isValid: false,
    componentName: ClientCreateComponent,
    data: null,
  };
  addAdminUserPanel = {
    id: 2,
    name: "Add admin user access",
    disabled: true,
    isExpanded: false,
    isValid: false,
    componentName: UserCreateComponent,
    data: null,
  };
  addTrialUserPanel = {
    id: 3,
    name: "Add trial users",
    disabled: false,
    isExpanded: false,
    isValid: false,
    componentName: UserListComponent,
    data: null,
  };
  addServiceUsersPanel = {
    id: 4,
    name: "Add service management users",
    disabled: true,
    isExpanded: false,
    isValid: false,
    componentName: ServiceUserListComponent,
    data: null,
  };
  panels: any[] = [];
  clientDetails: any;
  eventBusSub?: Subscription;
  clientId: String = "";
  breadcrumbTitle: string = "Add new company";
  isLoading: boolean = true;
  infoMsg: String = "";
  errorMsg: String = "";
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private eventBusService: EventBusService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppServices
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.clientId = this.route.snapshot.params["clientId"]
        ? this.route.snapshot.params["clientId"]
        : "new";
      if (this.clientId.toLowerCase() === "new") {
        this.panels = [
          { ...this.addCompanyInfoPanel },
          { ...this.addAdminUserPanel },
        ];
        this.isLoading = false;
        this.breadcrumbTitle = "Add new company";
      } else {
        this.breadcrumbTitle = "Edit company";
        this.getClientDetails();
      }

      this.eventBusService.readEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((action) => {
          if (action.name === "companyUpdated") {
            this.panels[0].isExpanded = !this.panels[0].isExpanded;
            this.panels[1].isExpanded = !this.panels[0].isExpanded;
          } else if (action.name === "company_status_change") {
            if ("trial" === action?.value?.toLowerCase()) {
              this.infoMsg =
                "Trial users should be given access to analyze only 2 video Ads and 2 display Ads with no access to download report or conduct A/B testing.";
              this.panels[1] = { ...this.addTrialUserPanel };
            } else {
              this.infoMsg = "";
              this.panels[1] = { ...this.addAdminUserPanel };
            }
          } else if (action.name === "toggle_service_request") {
            console.log("event received", action);
            // Based on "Service Request" feature turned on or off, show/hide the panel for adding Service Management Users
            var data = action?.value?.data;
            var toggle = action?.value?.toggle;
            // Find the index of the service request panel
            const servicePanelIndex = this.panels.findIndex(
              (panel) => panel.id === this.addServiceUsersPanel.id
            );
            if (toggle === true) {
              // add SM panel
              if (servicePanelIndex == -1) {
                this.panels.push({ ...this.addServiceUsersPanel, data });
              }
            } else {
              // remove SM panel
              if (servicePanelIndex !== -1) {
                this.panels.splice(servicePanelIndex, 1);
              }
            }
          } else if (action.name === "company_form_error") {
            if (action.value) {
              this.errorMsg = action.value;
              window.scrollTo(0, 0);
            } else {
              this.errorMsg = "";
            }
          } else if (action.name === "trial_user_saved") {
            this.getClientDetails();
          } else if (action.name === "company_saved") {
            if (action.value) {
              this.clientId = action.value.id;
              this.getClientDetails();
            }
          } else if (action.name === "company_updated") {
            if (action.value && this.panels.length > 1) {
              this.clientDetails = action.value;
               this.panels[1].data = action.value;
            }
          } else if (action.name === "user_deleted") {
            if (action.value) {
              this.clientId = action.value.id;
              this.getClientDetails();
            }
          } else if (action.name === "trialToActive") {
            setTimeout(() => {
              let response: any = {
                client: action.value,
                user: null,
              };
              this.panels = [
                {
                  ...this.addCompanyInfoPanel,
                  data: response,
                },
                {
                  ...this.addAdminUserPanel,
                  disabled: false,
                  data: response,
                },
              ];
            }, 0);
          } else if (action.name === "service_user_count_change") {
            // new service user added
            for (let i = 0; i < this.panels.length; i++) {
              // service request
              if (this.panels[i].id == this.addServiceUsersPanel.id) {
                this.panels[i].isValid = action.value > 0;
              }
            }
          } else if (
            action.name === "on_admin_setup_complete" ||
            action.name === "on_trial_setup_complete"
          ) {
            // collapse the admin panel and display the service user panel
            if (this.panels.length >= 3) {
              this.panels[1].isValid = true; // collapse admin setup
              this.panels[1].isExpanded = false; // collapse admin setup
              this.panels[2].isExpanded = true; // expand SM panel
              this.panels[2].disabled = false; // enable SM panel
            }
          }
        });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  buttonCallback = () => {
    console.log("isCompSetupCollapse");
  };

  getClientDetails(): void {
    this.appService.getClientDetails(this.clientId).subscribe((data) => {
      let response: any = data;
      if ("trial" === response?.client?.status?.toLowerCase()) {
        this.infoMsg =
          "Trial users should be given access to analyze only 2 Video Ads and 2 Display Ads with no access to download Report or conduct A/B Testing.";
        this.panels = [
          {
            ...this.addCompanyInfoPanel,
            isExpanded: false,
            isValid: true,
            componentName: ClientCreateComponent,
            data: response,
          },
          {
            ...this.addTrialUserPanel,
            disabled: true,
            isExpanded: true,
            isValid:
              response.user && (response.user.length > 0 || response.user.id),
            componentName:
              response.user && response.user.length > 0
                ? UserListComponent
                : UserCreateComponent,
            data: response,
          },
        ];
      } else if ("inactive" === response.client?.status?.toLowerCase()) {
        this.infoMsg = "";
        this.panels = [
          {
            ...this.addCompanyInfoPanel,
            isValid: true,
            componentName: ClientCreateComponent,
            data: response,
          },
          {
            ...this.addAdminUserPanel,
            data: response,
          },
        ];
        this.isLoading = false;
      } else {
        console.log("clientSetupComponent getClientDetails", data);
        
        //active
        this.infoMsg = "";
        this.panels = [
          {
            ...this.addCompanyInfoPanel,
            isExpanded: false,
            isValid: true,
            componentName: ClientCreateComponent,
            data: response,
          },
          {
            ...this.addAdminUserPanel,
            disabled: false,
            isExpanded: true,
            isValid:
              (response.user &&
                response.user.length > 0 &&
                response.user[0].id) ||
              response.client.isClientAdmin
                ? true
                : false,
            componentName: UserCreateComponent,
            data: response,
          },
        ];
      }
      if (response?.client?.featureAccess?.serviceRequest)
        this.panels.push({
          ...this.addServiceUsersPanel,
          disabled: false,
          data: response,
          isValid: response?.serviceManagers?.length > 0,
        });
      this.isLoading = false;
    });
  }
}
