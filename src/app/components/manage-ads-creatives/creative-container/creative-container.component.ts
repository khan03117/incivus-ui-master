import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { CreateCampaignComponent } from '../create-campaign/create-campaign.component';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { AppServices } from 'src/app/_services/app.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { EventBusService } from "../../../_shared/event-bus.service";
import { StorageService } from "src/app/_services/storage.service";

@Component({
  selector: "app-creative-container",
  templateUrl: "./creative-container.component.html",
  styleUrls: ["./creative-container.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class CreativeContainerComponent {
  creatives: any = [];
  filterList: string = "all";
  clientId: string = "";
  breadcrumb: any = [
    {
      name: "All Creatives",
      link: null,
    },
  ];
  eventBusSub?: Subscription;
  isTrialUser: boolean = false;
  isIncAdmin: boolean = false;
  clientList: any = [];
  flightType: string = "pre-flight";
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private eventBusService: EventBusService,
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private service: AppServices,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.flightType = params["flightType"];
      console.log("flightType", this.flightType);

      this.breadcrumb = [
        {
          name: this.flightType,
        },
      ];
    });
    setTimeout(() => {
      let user = this.storage.getUser();
      if (user && user.roles.includes("INCIVUS_ADMIN")) {
        this.isIncAdmin = true;
        this.clientList = this.storage.getClientList();
      }
      if (user && user.roles.includes("TRIAL_USER")) {
        this.isTrialUser = true;
      }
      this.loadCreatives();
      this.eventBusService.readEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((action) => {
          if (action.name === "campaign_linked") {
            this.loadCreatives();
          } else if (action.name === "analysis_initiated") {
            this.loadCreatives();
          }
        });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadCreatives(): void {
    if (!this.isIncAdmin) {
      this.service.getCreatives().subscribe({
        next: (data) => {
          console.log("getCreatives");

          let creatives: any = data;
          this.creatives = creatives.ads;
        },
        error: (error) => {
          this.creatives = [];
        },
      });
    } else {
      if (!this.storage.clientId) {
        this.clientId = this.clientList[0].id;
      } else {
        this.clientId = this.storage.clientId;
        this.storage.clientId = this.clientId;
      }
      this.getClientCreatives();
    }
  }

  getClientCreatives() {
    this.service.getClientCreatives(this.clientId, this.flightType).subscribe({
      next: (data) => {
        let creatives: any = data;
        this.creatives = creatives.ads;
      },
      error: (error) => {
        this.creatives = [];
      },
    });
  }

  filterCreatives(filter: any) {
    this.filterList = filter;
  }

  loadClientCreatives(clientId: any) {
    this.clientId = clientId;
    this.storage.clientId = this.clientId;
    this.getClientCreatives();
  }

  openCreateCampaignModal() {
    this.dynamicModalService.createComponentModal(
      "",
      CreateCampaignComponent,
      this.viewContainerRef
    );
    this.dynamicModalService.updateModalCotentComponent(
      MODALCOMPONENT.CREATE_CAMPAIGN
    );
  }
  openCreateCampaign() {
    this.router.navigate(["campaign", "create"]);
  }
  createCreatives() {
    this.router.navigate(["creatives", "create"]);
  }

}
