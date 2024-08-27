import {
  Component,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  CarouselComponent,
  OwlOptions,
  SlidesOutputData,
} from "ngx-owl-carousel-o";
import { MODALCOMPONENT } from "src/app/common/modal/modal.constants";
import { DynamicModalComponentService } from "src/app/common/services/dyamic-modal-component.service";
import { ShareCampaignComponent } from "../share-campaign/share-campaign.component";
import { StorageService } from "src/app/_services/storage.service";
import { AppServices } from "src/app/_services/app.service";
import { CreateCampaignComponent } from "../create-campaign/create-campaign.component";
import { CarouselService } from "ngx-owl-carousel-o/lib/services/carousel.service";
import { Subject, Subscription, takeUntil } from "rxjs";
import { EventBusService } from "../../../_shared/event-bus.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { EventData } from "src/app/_shared/event.class";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-campaign-list",
  templateUrl: "./campaign-list.component.html",
  styleUrls: ["./campaign-list.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class CampaignListComponent {
  getChannelIconPath(channel: any) {
    switch (channel) {
      case "facebook":
        return "../../../../assets/icons/facebook.svg";
      default:
        return null;
    }
  }
  flightType: string = "in-flight";
  creatives: any = [];
  filterList: string = "all";
  creativeData: any = [];

  campaignData: any = [];
  originalCampaignData: any = [];
  sharedCampaignData: any = [];
  finalCreativeData: any = [];
  eventBusSub?: Subscription;
  client: any = {};
  user: any = {};
  isAnalyze: boolean = false;

  sIncAdmin: boolean = false;
  isLoading: boolean = false;
  checked = false;
  indeterminate = false;
  infoMsg: string =
    "You can create company setup and come back to edit the same as required.";
  errorMsg: string = "";
  breadcrumb: any = [
    {
      name: "In-flight",
      link: "/creatives/in-flight/list",
    },
    {
      name: "All Campaign",
      link: null,
    },
  ];

  creativeOptions: OwlOptions = {
    autoWidth: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    margin: 16,
    responsive: {
      1024: {
        items: 4,
      },
    },
    nav: true,
    navText: [
      '<span class="arrow-left"></span>',
      '<span class="arrow-right"></span>',
    ],
  };
  listOfData = [];
  searchText = "";
  campaignOptions: OwlOptions = {
    autoWidth: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    margin: 16,
    responsive: {
      1024: {
        items: 6,
      },
    },
    nav: true,
    navText: [
      '<span class="arrow-left"></span>',
      '<span class="arrow-right"></span>',
    ],
  };
  isIncAdmin: boolean = false;
  isTrialUser: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  @ViewChild("creativeCarousel", { static: true })
  public creativeSlides!: CarouselComponent;
  @ViewChild("campaignCarousel", { static: true })
  public campaignSlides!: CarouselComponent;

  constructor(
    private eventBusService: EventBusService,
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private storage: StorageService,
    private service: AppServices,
    private el: ElementRef,
    private route: Router,
    private modal: NzModalService,
    private activatedRoute: ActivatedRoute
  ) {
    this.creativeData = [];
    this.filterList = "all";
  }

  getCes(ces: number): string {
    if (ces) {
      return (ces * 100).toFixed(2).toString();
    }
    return "";
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['filterList'] && changes['filterList'].currentValue) {
  //     if (changes['filterList'].currentValue === 'all') {
  //       this.finalCreativeData = this.creativeData;
  //     } else {
  //       this.finalCreativeData = this.creativeData.filter((data: any) => {
  //         return data.metadata.artifactType.toLowerCase() === changes['filterList'].currentValue;
  //       });
  //     }
  //   }
  //   if (changes['creativeData'] && changes['creativeData'].currentValue) {
  //     this.finalCreativeData = changes['creativeData'].currentValue;
  //     // this.reInitCarousel(this.creativeSlides);
  //     // this.reInitCarousel(this.campaignSlides);
  //   }

  // }

  getInFlightCampaignDetails() {
    if (this.flightType === "in-flight") {
      this.service.getInflightCampaigns().subscribe(
        (response: any) => {
          console.log("InFlightCampaignDetails", response);
          this.campaignData = response?.campaigns;
          this.originalCampaignData = response?.campaigns;
        },
        (error) => {
          console.error("Request failed:", error);
          this.isLoading = false;
          this.errorMsg =
            error?.error?.message ??
            "We are facing some technical issue, please try again later.";
        }
      );
    } else {
      this.service.getPostflightCampaigns().subscribe(
        (response: any) => {
          console.log("InFlightCampaignDetails", response);
          this.campaignData = response?.campaigns;
          this.originalCampaignData = response?.campaigns;
          if (response?.errors && response?.errors?.length > 0)
            this.errorMsg = response?.errors[0] ?? "";
        },
        (error) => {
          console.error("Request failed:", error);
          this.errorMsg =
            error?.error?.message ??
            "We are facing some technical issue, please try again later.";
        }
      );
    }
  }

  reInitCarousel(slideObj: any): void {
    const creativeService = slideObj as any;
    const creativeCarouselService =
      creativeService.carouselService as CarouselService;

    creativeCarouselService.refresh();
    creativeCarouselService.update();
  }

  loadCampaignData(): void {
    // let user = this.storage.getUser();
    // if (user.campaigns && user.campaigns.length) {
    //   this.campaignData = user.campaigns;
    // }
    // if (user.sharedCampaigns && user.sharedCampaigns.length) {
    //   this.campaignData = this.campaignData.concat(user.sharedCampaigns);
    // }
    // this.campaignData.forEach((campaign: any) => {
    //   this.service.getCampaignCount(campaign.campaignName).subscribe({
    //     next: data => {
    //       let result: any = data;
    //       campaign.campaignCount = result.campaignCount;
    //     }
    //   })
    // });
  }

  openShareCampaignModal(campaign: any) {
    this.service.getSharableUserList(campaign.brand).subscribe({
      next: (data) => {
        this.dynamicModalService.setSharableUserList(data);
        this.dynamicModalService.setCampaign(campaign);
        this.dynamicModalService.createComponentModal(
          "",
          ShareCampaignComponent,
          this.viewContainerRef
        );
        this.dynamicModalService.updateModalCotentComponent(
          MODALCOMPONENT.SHARE_CAMPAIGN
        );
      },
      error: (err) => {},
    });
  }

  openCreative(artifactId: string) {
    //todo:
    // this.route.navigate(["creatives", artifactId]);
  }

  gotoCampaign(campaign: any) {
    //todo:
    // this.route.navigate(["campaign", campaign.brand.toLowerCase(), campaign.campaignName.toLowerCase()]);
  }

  openLinkCampaignModal(metadata: any) {
    this.dynamicModalService.setCreativeMeta(metadata);
    this.dynamicModalService.createComponentModal(
      "",
      CreateCampaignComponent,
      this.viewContainerRef
    );
    this.dynamicModalService.updateModalCotentComponent(
      MODALCOMPONENT.LINK_CAMPAIGN
    );
  }

  openEditCampaignModal(campaign: any) {
    this.route.navigate([
      this.flightType,
      campaign?.account_id,
      "campaigns",
      campaign?.id,
    ]);
  }

  analyze = (artifactId: string) => {
    this.service.analyzeCreative(artifactId).subscribe({
      next: (data: any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent:
            "We are analyzing the creative now. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.eventBusService.emit(new EventData("analysis_initiated", ""));
          },
        });
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are unable to analyze it, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {},
        });
      },
    });
  };

  reanalyze(artifactId: string): void {
    this.service.retryAnalyzeCreative(artifactId).subscribe({
      next: (data: any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent:
            "We have reinitiated the analysis. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.eventBusService.emit(new EventData("analysis_initiated", ""));
          },
        });
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent:
            "We are unable to reinitiate the analysis now, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {},
        });
      },
    });
  }

  showReport(score: number, type: string): boolean {
    if (this.isIncAdmin) {
      if (score >= 90) {
        return true;
      } else {
        return false;
      }
    }
    if (type === "image") {
      if (this.client.featureAccess.imageAd.analyze.viewReport) {
        if (
          this.user.permission.viewSummaryPage ||
          this.user.permission.viewFullReport
        ) {
          if (score == 100) {
            return true;
          }
        }
      }
    } else {
      if (this.client.featureAccess.videoAd.analyze.viewReport) {
        if (
          this.user.permission.viewSummaryPage ||
          this.user.permission.viewFullReport
        ) {
          if (score == 100) {
            return true;
          }
        }
      }
    }
    return false;
  }

  showDownloadReport(score: number, type: string): boolean {
    if (this.isIncAdmin || this.isTrialUser) {
      return false;
    }

    if (type === "image") {
      if (this.client.featureAccess.imageAd.analyze.downloadReport) {
        if (
          this.user.permission.downloadFullReport ||
          this.user.permission.downloadSummaryPage
        ) {
          if (score == 100) {
            return true;
          }
        }
      }
    } else {
      if (this.client.featureAccess.videoAd.analyze.downloadReport) {
        if (
          this.user.permission.downloadFullReport ||
          this.user.permission.downloadSummaryPage
        ) {
          if (score == 100) {
            return true;
          }
        }
      }
    }
    return false;
  }

  viewReport = (id: string) => {
    //todo:
    // this.route.navigate(['reports', id]);
  };

  ngOnInit(): void {
    //todo:
    setTimeout(() => {
      this.user = this.storage.getUser();
      this.client = this.user && this.user.client ? this.user.client : null;
      if (this.user && this.user.roles.includes("INCIVUS_ADMIN")) {
        this.isIncAdmin = true;
      }
      if (this.user && this.user.roles.includes("TRIAL_USER")) {
        this.isTrialUser = true;
      }
      this.isAnalyze = this.isIncAdmin
        ? this.isIncAdmin
        : this.user && this.user.permission.isAnalyze;
      // this.finalCreativeData = this.creativeData;
      this.loadCampaignData();
      this.eventBusService.readEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((action) => {
          if (action.name === "campaign_created") {
            this.loadCampaignData();
          } else if (action.name === "campaign_linked") {
            this.loadCampaignData();
          }
        });
    }, 10);
    this.activatedRoute.params.subscribe((params) => {
      console.log("params", params);
      this.flightType = params["flightType"];
      this.breadcrumb = [
        {
          name: this.flightType,
          link: "/creatives/" + this.flightType + "/list",
        },
        {
          name: "All Campaign",
          link: null,
        },
      ];
    });

    this.getInFlightCampaignDetails();
  }
  isInFlight(): boolean {
    return this.flightType === "in-flight";
  }
  save() {}

  filter() {
    this.campaignData = [];
    console.log("searchText = ", this.searchText);
    if (this.searchText == "") {
      this.campaignData = this.originalCampaignData;
    } else {
      for (let i = 0; i < this.originalCampaignData.length; i++) {
        console.log("Name = ", this.originalCampaignData[i]["name"]);
        if (
          this.originalCampaignData[i]["name"]
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        ) {
          this.campaignData.push(this.originalCampaignData[i]);
        }
      }
    }
  }

  edit() {}

  onAllChecked(value: boolean): void {
    // this.listOfData.forEach(item => this.updateCheckedSet(item.id, value));
    // this.refreshCheckedStatus();
  }
}
