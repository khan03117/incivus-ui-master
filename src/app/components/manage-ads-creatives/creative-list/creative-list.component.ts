import { Component, ViewChild, ViewContainerRef, ViewEncapsulation, Input, SimpleChanges, ElementRef, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { ShareCampaignComponent } from '../share-campaign/share-campaign.component';
import { StorageService } from 'src/app/_services/storage.service';
import { AppServices } from 'src/app/_services/app.service';
import { CreateCampaignComponent } from '../create-campaign/create-campaign.component';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { EventBusService } from '../../../_shared/event-bus.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventData } from 'src/app/_shared/event.class';

@Component({
  selector: "app-creative-list",
  templateUrl: "./creative-list.component.html",
  styleUrls: ["./creative-list.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class CreativeListComponent {
  @Input() public creativeData: any = [];
  @Input() public filterList: string = "";
  @Input() public flightType: string = "";
  campaignData: any = [];
  sharedCampaignData: any = [];
  finalCreativeData: any = [];
  eventBusSub?: Subscription;
  client: any = {};
  user: any = {};
  isAnalyze: boolean = false;
  isLoading: boolean = true;
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
  finalLoad: boolean = true;

  constructor(
    private eventBusService: EventBusService,
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private storage: StorageService,
    private service: AppServices,
    private el: ElementRef,
    private route: Router,
    private modal: NzModalService
  ) {
    this.creativeData = [];
    //this.filterList ='all';
  }

  getCes(ces: number): string {
    if (ces) {
      return (ces * 100).toFixed(2).toString();
    }
    return "";
  }

  ngOnInit() {
    console.log("creative-list flightType", this.flightType);
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["filterList"] && changes["filterList"].currentValue) {
      if (changes["filterList"].currentValue === "all") {
        this.finalCreativeData = this.creativeData;
      } else {
        this.finalCreativeData = this.creativeData.filter((data: any) => {
          return (
            data.metadata.artifactType.toLowerCase() ===
            changes["filterList"].currentValue
          );
        });
      }
    }
    if (changes["creativeData"] && changes["creativeData"].currentValue) {
      if (this.filterList === "image" || this.filterList === "video") {
        this.finalCreativeData = this.creativeData.filter((data: any) => {
          return data.metadata.artifactType.toLowerCase() === this.filterList;
        });
      } else {
        this.finalCreativeData = changes["creativeData"].currentValue;
        this.finalLoad = false;
      }
      // this.reInitCarousel(this.creativeSlides);
      // this.reInitCarousel(this.campaignSlides);
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
    let user = this.storage.getUser();

    if (!user.campaign || user.campaigns.length == 0) {
      user.campaigns["cmpType"] = "user";
      this.campaignData = user.campaigns;
    }

    if (user.campaigns && user.campaigns.length) {
      user.campaigns.forEach((element: any) => {
        element["cmpType"] = "user";
      });
      this.campaignData = user.campaigns;
    }
    if (user.sharedCampaigns && user.sharedCampaigns.length) {
      user.sharedCampaigns.forEach((element: any) => {
        element["cmpType"] = "shared";
      });
      this.campaignData = this.campaignData.concat(user.sharedCampaigns);
    }
    this.campaignData.forEach((campaign: any) => {
      this.service.getCampaignCount(campaign.campaignName).subscribe({
        next: (data) => {
          let result: any = data;
          campaign.campaignCount = result.campaignCount;
        },
      });
    });
    this.isLoading = false;
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
    this.route.navigate(["creatives", artifactId]);
  }

  gotoCampaign(campaign: any) {
    this.route.navigate([
      "campaign",
      campaign.brand.toLowerCase(),
      campaign.campaignName.toLowerCase(),
    ]);
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

  openEditCampaignModal(campaignName: string) {
    this.dynamicModalService.setCampaignName(campaignName);
    this.dynamicModalService.createComponentModal(
      "",
      CreateCampaignComponent,
      this.viewContainerRef
    );
    this.dynamicModalService.updateModalCotentComponent(
      MODALCOMPONENT.EDIT_CAMPAIGN
    );
  }

  delete(artifactId: string) {
    this.modal.confirm({
      nzTitle: "Confirm delete",
      nzContent: "Do you really want to delete the creative?",
      nzOkText: "Yes",
      nzClassName: "short-modal",
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => {
        this.deleteCreative(artifactId);
      },
      nzCancelText: "No",
      nzOnCancel: () => true,
    });
  }

  deleteCreative(artifactId: string) {
    this.service.deleteCreatives(artifactId).subscribe({
      next: (data: any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "Creative deleted successfully",
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
          nzContent: "Unable to delete creative. Please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {},
        });
      },
    });
  }

  deleteCampaign(campaignName: string) {
    this.modal.confirm({
      nzTitle: "Confirm delete",
      nzContent: "Do you really want to delete the campaign?",
      nzOkText: "Yes",
      nzClassName: "short-modal",
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => {
        this.deleteCampaignConfirm(campaignName);
      },
      nzCancelText: "No",
      nzOnCancel: () => true,
    });
  }

  deleteCampaignConfirm(campaignName: string) {
    this.service.deleteCampaign(campaignName.toLowerCase()).subscribe({
      next: (data: any) => {
        if (data.status.toLowerCase() === "success") {
          this.modal.success({
            nzTitle: "Success",
            nzContent: "Campaign deleted successfully",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              let user = this.storage.getUser();
              let campaigns = user.campaigns.filter((camp: any) => {
                return (
                  camp.campaignName.toLowerCase() !== campaignName.toLowerCase()
                );
              });
              user.campaigns = campaigns;
              this.storage.saveUser(user);
              this.eventBusService.emit(new EventData("campaign_created", ""));
            },
          });
        } else {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Unable to delete campaign. Please try again later",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
        }
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "Unable to delete campaign. Please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {},
        });
      },
    });
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
    this.route.navigate(["reports", id]);
  };
}
