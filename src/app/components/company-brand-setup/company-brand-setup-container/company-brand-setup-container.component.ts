import { Component, ViewChild } from "@angular/core";
import { Subject, Subscription, takeUntil } from "rxjs";
import { CompanySetupComponent } from "../company-setup/company-setup.component";
import { BrandSetupComponent } from "../brand-setup/brand-setup.component";
import { StorageService } from "../../../_services/storage.service";
import { AppServices } from "src/app/_services/app.service";
import { EventBusService } from "../../../_shared/event-bus.service";
import { DynamicModalComponentService } from "src/app/common/services/dyamic-modal-component.service";
import { EventData } from "src/app/_shared/event.class";
import { Router } from "@angular/router";

@Component({
  selector: "app-company-brand-setup-container",
  templateUrl: "./company-brand-setup-container.component.html",
  styleUrls: ["./company-brand-setup-container.component.less"],
})
export class CompanyBrandSetupContainerComponent {
  panels = [
    {
      name: "Setup company structure",
      disabled: false,
      isExpanded: false,
      isValid: false,
      componentName: CompanySetupComponent,
      data: null,
    },
    {
      name: "Create brand structure",
      disabled: false,
      isExpanded: false,
      isValid: false,
      componentName: BrandSetupComponent,
      data: null,
    },
  ];
  isLoading: boolean = true;
  eventBusSub?: Subscription;
  clientId: string = "";
  errorMsg: string = "";
  isSubmit: boolean = false;
  isIncAdmin: boolean = false;
  step1Complete: boolean = false;
  showDone: boolean = false;
  check:boolean=false;
  infoMsg: string =
    "You can create company setup and come back to edit the same as required.";
  @ViewChild(BrandSetupComponent) private brandSetupComp!: BrandSetupComponent;
  breadcrumb: any = [
    {
      name: "Settings",
      link: "/client/list",
    },
    {
      name: "Client setup",
      link: null,
    },
  ];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private eventBusService: EventBusService,
    private appService: AppServices,
    private storageService: StorageService,
    private brandService: DynamicModalComponentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.brandService.clearEverything();
      let user = this.storageService.getUser();
      if (user && user.roles.includes("INCIVUS_ADMIN")) {
        this.isIncAdmin = true;
      }
      this.clientId = user.client.id;
      this.getClientDetails();

      this.eventBusService.readEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((action) => {
          if (action.name === "client_updated") {
            this.step1Complete = true;
            this.check=true;
            let clientData: any = action.value;
            let pan2Complete = this.getPan2CompleteStatus(
              clientData.brandDetails
            );
            if (clientData.brandDetails && clientData.brandDetails.length > 0) {
              this.showDone = true;
            }

            this.panels = [
              {
                name: "Setup company structure",
                disabled: false,
                isExpanded: false,
                isValid:
                  clientData.entity && clientData.entity.length ? true : false,
                componentName: CompanySetupComponent,
                data: clientData,
              },
              {
                name: "Create brand structure",
                disabled: false,
                isExpanded: true,
                isValid: pan2Complete,
                componentName: BrandSetupComponent,
                data: clientData,
              },
            ];
          } else if (action.name === "company_form_error") {
            if (action.value) {
              this.errorMsg = action.value;
              window.scrollTo(0, 0);
            } else {
              this.errorMsg = "";
            }
          } else if (action.name === "brand_guidelines_saved") {
            console.log("Brand guidelines!")
            this.check=true;
            this.getClientDetails();
          } else if (action.name === "Done_Success") {
            
            if (this.isIncAdmin) {
              this.router.navigate(["client", "list"]);
            } else {
              this.collapseAll();
            }
          }
          else if(action.name==='brandAdded'){
            this.check=true;
          }
        });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getPan2CompleteStatus(data: any): boolean {
    if (data && data.length > 0) {
      let isComplete: boolean = false;
      data.forEach((bd: any) => {
        if (!isComplete) {
          if (bd.masterBrand.id) {
            isComplete = true;
          }
          if (!isComplete) {
            bd.productBrand.forEach((pd: any) => {
              if (!isComplete) {
                if (pd.id) {
                  isComplete = true;
                }
              }
            });
          }
        }
      });
      return isComplete;
    } else {
      return false;
    }
  }

  collapseAll() {
    this.isSubmit = false;
    this.getClientDetails();
  }

  getClientDetails(): void {
    this.appService.getClientDetails(this.clientId).subscribe({
      next: (data) => {
        let clientResponse: any = data;
        let isBGSaved = this.getPan2CompleteStatus(
          clientResponse.client.brandDetails
        );
        let isEntity = false;
        if (
          clientResponse.client.entity &&
          clientResponse.client.entity.length > 0
        ) {
          isEntity = true;
        }
        if (isEntity) {
          this.step1Complete = true;
        }

        if (
          clientResponse.client.brandDetails &&
          clientResponse.client.brandDetails.length > 0
        ) {
          this.brandService.setCompleteBD(clientResponse.client.brandDetails);
          this.showDone = true;
        }

        this.panels = [
          {
            name: "Setup company structure",
            disabled: false,
            isExpanded: !isEntity,
            isValid: isEntity,
            componentName: CompanySetupComponent,
            data: clientResponse.client,
          },
          {
            name: "Create brand structure",
            disabled: false,
            isExpanded: isEntity,
            isValid: isBGSaved,
            componentName: BrandSetupComponent,
            data: clientResponse.client,
          },
        ];
        this.isLoading = false;
      },
      error: (err) => {
        this.panels = [
          {
            name: "Setup company structure",
            disabled: false,
            isExpanded: false,
            isValid: false,
            componentName: CompanySetupComponent,
            data: null,
          },
          {
            name: "Create brand structure",
            disabled: false,
            isExpanded: false,
            isValid: false,
            componentName: BrandSetupComponent,
            data: null,
          },
        ];
        this.isLoading = false;
      },
    });
  }

  save = () => {
    if (!this.isSubmit) {
      // this.isSubmit = true;
      this.eventBusService.emit(new EventData("initiateSave", null));
    }
  };
}
