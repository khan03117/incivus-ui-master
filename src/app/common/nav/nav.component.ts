import { Component, HostListener, OnInit } from "@angular/core";
import { StorageService } from "../../_services/storage.service";
import { Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { CONSTANTS } from "../constants";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.less"],
})
export class NavComponent implements OnInit {
  isCollapsed: boolean = false;
  isIncAdmin: boolean = false;
  isClAdmin: boolean = false;
  isUser: boolean = false;
  isServiceManager: boolean = false;
  isTrialUser: boolean = false;
  user: any;
  public hideMenu: boolean = false;
  isAdmin: boolean = false;
  page: string = "";
  role: string = "";
  campaignData: any = [];
  eventBusSub?: Subscription;
  ROLES = CONSTANTS.ROLES;
  private ngUnsubscribe = new Subject<void>();
  showABTest: boolean = false;
  show = {
    preFlight: false,
    inFlight: false,
    postFlight: false,
    serviceRequest: false,
  };

  constructor(
    private eventBusService: EventBusService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (document.body.classList.contains("navCollapse")) {
      this.isCollapsed = true;
      if (
        document
          .getElementById("subMenuList")
          ?.classList.contains("ant-menu-submenu-open ant-menu-submenu-active")
      ) {
        document
          .getElementById("subMenuList")
          ?.classList.remove("ant-menu-submenu-open ant-menu-submenu-active");
      }
    }

    setTimeout(() => {
      const url = this.router.url;
      if (url.includes("/client/user")) {
        this.page = "users";
      } else if (url.includes("/service-requests/all")) {
        this.page = "service-requests/all";
      } else if (url.includes("/settings/service-requests")) {
        this.page = "settings/service-requests";
      } else if (url.includes("/service-requests/archived")) {
        this.page = "service-requests/archived";
      } else if (url.includes("/media-accounts")) {
        this.page = "media-accounts";
      } else if (url.includes("/reports/pre-flight")) {
        this.page = "reports-pre-flight";
      } else if (url.includes("/reports/in-flight")) {
        this.page = "reports-in-flight";
      } else if (url.includes("/reports/post-flight")) {
        this.page = "reports-post-flight";
      } else if (url.includes("creatives/pre-flight")) {
        this.page = "pre-flight";
      } else if (url.includes("creatives/in-flight")) {
        this.page = "in-flight";
      } else if (url.includes("creatives/post-flight")) {
        this.page = "post-flight";
      } else if (url.includes("/client/role")) {
        this.page = "roles";
      } else if (url.includes("/client/permission")) {
        this.page = "permission";
      } else if (url.includes("/reports")) {
        this.page = "reports";
      } else if (url.includes("/creatives/list/pre-flight")) {
        this.page = "creatives/list/pre-flight";
      } else if (url.includes("/creatives/list/in-flight")) {
        this.page = "creatives/list/in-flight";
      } else if (url.includes("/creatives/list/post-flight")) {
        this.page = "creatives/list/post-flight";
      } else if (url.includes("/campaign")) {
        let campaignName = url.split("/");
        this.page = campaignName[campaignName.length - 1];
      } else if (url.includes("/compare")) {
        this.page = "compare";
      } else {
        this.page = "company";
      }
      this.user = this.storageService.getUser();
      let fa = this.user?.client?.featureAccess;
      console.log("user ", this.user);
      if (this.user && this.user.roles) {
        this.isIncAdmin = this.user.roles.includes(this.ROLES.INC_ADMIN);
        this.isClAdmin = this.user.roles.includes(this.ROLES.CL_ADMIN);
        this.isServiceManager = this.user.roles.includes(
          this.ROLES.SERVICE_MANAGER
        );
        this.isTrialUser = this.user.roles.includes(this.ROLES.TRIAL_USER);
      }
      console.log("page ", this.page, url);
      if (this.user.client && this.user.client.featureAccess) {
        if (
          this.user.client.featureAccess.imageAd.isABTest ||
          this.user.client.featureAccess.videoAd.isABTest
        ) {
          this.showABTest = true;
        } else {
          this.showABTest = false;
        }
        if (
          this.user.client.featureAccess.imageAd.isABTest ||
          this.user.client.featureAccess.videoAd.isABTest
        ) {
        } else {
          this.showABTest = false;
        }
      }
      console.log(`nav.component user:`, this.user);
      this.isUser =
        !this.isIncAdmin &&
        !this.isClAdmin &&
        !this.isServiceManager &&
        !this.isTrialUser;
      this.isAdmin = this.isClAdmin || this.isIncAdmin;

      this.show.preFlight =
        (fa?.imageAd?.isAvailable ||
          fa?.videoAd?.isAvailable ||
          fa?.preFlight?.isAvailable) &&
        (this.user.permission.isUpload ||
          this.user.permission.isAnalyze ||
          this.isTrialUser);
      this.show.inFlight =
        fa?.inFlight?.isAvailable &&
        (this.user.permission.isInFlight || this.isTrialUser);
      this.show.postFlight =
        fa?.postFlight?.isAvailable &&
        (this.user.permission.isPostFlight || this.isTrialUser);
      this.show.serviceRequest =
        (this.user?.permission?.serviceRequest == true || this.isTrialUser) &&
        fa?.serviceRequest &&
        !this.isServiceManager;
      this.eventBusService.readEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((action) => {
          if (action.name === "campaign_created") {
            this.loadCampaignData();
          }
        });

      if (this.user && this.user.campaigns && this.user.campaigns.length) {
        this.campaignData = this.user.campaigns;
      }
      if (
        this.user &&
        this.user.sharedCampaigns &&
        this.user.sharedCampaigns.length
      ) {
        this.campaignData = this.campaignData.concat(this.user.sharedCampaigns);
      }
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadCampaignData() {
    let user = this.storageService.getUser();
    if (!user.campaigns || user.campaigns.length == 0) {
      this.campaignData = this.user.campaigns;
    }
    if (user.campaigns && user.campaigns.length) {
      this.campaignData = user.campaigns;
    }
    if (user.sharedCampaigns && user.sharedCampaigns.length) {
      this.campaignData = this.campaignData.concat(user.sharedCampaigns);
    }
  }

  floatNavMenu() {
    document.body.classList.toggle("navCollapse");
    this.isCollapsed = !this.isCollapsed;
  }

  openPage(path: any) {
    this.page = "";
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(path);
  }

  @HostListener("window:popstate", ["$event.target"])
  onPopState(event: any): void {
    setTimeout(() => {
      // this.page = "";
      // let element = document.querySelectorAll('.ant-menu-item-selected');
      // for (var i = 0; i < element.length; i++) {
      //     let htmlElement = element[i] as HTMLElement;
      //     htmlElement.classList.remove("ant-menu-item-selected");
      // }
      // this.ngOnInit();
    }, 60);
  }
}
