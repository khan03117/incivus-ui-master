import {
  ChangeDetectorRef,
  Component,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "src/app/_services/storage.service";
import { AppServices } from "src/app/_services/app.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { DynamicModalComponentService } from "src/app/common/services/dyamic-modal-component.service";
import { DisclaimerComponent } from "../disclaimer/disclaimer.component";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { EventData } from "src/app/_shared/event.class";

interface MetaData {
  id: string;
  title: string;
  artifactType: string;
  brand: string;
  status: number;
  uploadedAt: string;
  thumbnail: string;
  name: string;
  createdBy: string;
}

interface ArtifactResponse {
  metadata: MetaData;
  url: string;
}

@Component({
  selector: "app-all-reports",
  templateUrl: "./all-reports.component.html",
  styleUrls: ["./all-reports.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class AllReportsComponent {
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ArtifactResponse[] = [];
  listOfData: ArtifactResponse[] = [];
  copylistOfData: ArtifactResponse[] = [];
  setOfCheckedId = new Set<String>();
  adsCount: number = 0;
  client: any = {};
  user: any = {};
  searchText: string = "";
  currentDate: string = "";
  timeperiod1: Date;
  timeperiod = 100;
  isAnalyze: boolean = false;
  breadcrumb: any = [
    {
      name: "Reports",
      link: null,
    },
    {
      name: "All reports",
      link: null,
    },
  ];
  reportType: string;
  isIncAdmin: boolean = false;
  clientId: string = "";
  clientList: any = [];

  constructor(
    private storage: StorageService,
    private router: Router,
    private appService: AppServices,
    private modal: NzModalService,
    private activatedRoute: ActivatedRoute,
    private dynamicServiceModal: DynamicModalComponentService,
    private viewContainerRef: ViewContainerRef,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log("params", params);
      this.reportType = params["reportType"];
      console.log("reportType = ", this.reportType);
    });
    setTimeout(() => {
      this.user = this.storage.getUser();
      this.client = this.user ? this.user.client : null;
      if (this.user.disclaimerAccDate != null) {
        this.getCurrentDate();
        this.timeperiod1 = new Date(this.user.disclaimerAccDate);
        this.getDiff();
      } else {
        this.timeperiod = 100;
      }
      if (this.user && this.user.roles.includes("INCIVUS_ADMIN")) {
        this.isIncAdmin = true;
        let clientList = this.storage.getClientList();
        const filteredList = clientList.filter(
          (item: any) =>
            item.features &&
            this.reportType &&
            item.features.toLowerCase().includes(this.reportType.toLowerCase())
        );
        this.clientList = filteredList;
        
      }
      this.isAnalyze =
        this.user && this.user.permission
          ? this.user.permission.isAnalyze
          : false;
      console.log(
        "all-reports user",
        this.user?.id,
        this.storage.clientId,
        this.clientId
      );
      this.getAdsList();
    }, 10);
  }

  loadClientReports(clientId: any) {
    this.clientId = clientId;
    this.storage.clientId = this.clientId;
    this.getAdsList();
  }

  getStatusLabel(status: number): string {
    let result = "";
    switch (status.toString()) {
      case "0":
        result = "Not analyzed";
        break;
      case "10":
        result = "In progress";
        break;
      case "50":
        result = "Failed";
        break;
      case "100":
        result = "Completed";
        break;
      default:
        result = "In progress";
        break;
    }

    return result;
  }

  analyze = (artifactId: string) => {
    this.appService.analyzeCreative(artifactId).subscribe({
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
            this.getAdsList();
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
    this.appService.retryAnalyzeCreative(artifactId).subscribe({
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
            this.getAdsList();
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

  filter() {
    const targetValue: ArtifactResponse[] = [];
    this.copylistOfData.forEach((value: any) => {
      if (
        (value.metadata["title"] &&
          value.metadata["title"]
            .toString()
            .toLocaleLowerCase()
            .includes(this.searchText.toLocaleLowerCase())) ||
        (value.metadata["artifactType"] &&
          value.metadata["artifactType"] === "image" &&
          ["Display Ad"]
            .toString()
            .toLocaleLowerCase()
            .includes(this.searchText.toLocaleLowerCase())) ||
        (value.metadata["artifactType"] &&
          value.metadata["artifactType"] === "video" &&
          ["Video Ad"]
            .toString()
            .toLocaleLowerCase()
            .includes(this.searchText.toLocaleLowerCase()))
      ) {
        targetValue.push(value);
      }
    });
    this.adsCount = targetValue.length;
    this.listOfData = targetValue;
  }

  getAdsList(): void {
    if (this.isIncAdmin) {
      if (!this.storage.clientId) {
        if (this.clientList != null && this.clientList.length > 0)
          this.clientId = this.clientList[0].id;
      } else {
        this.clientId = this.storage.clientId;
      }
      if (this.clientId)
        this.appService
          .getAllCreativesForClient(this.clientId, this.reportType)
          .subscribe((data: any) => {
            let response: ArtifactResponse[] = data.ads;
            if (response.length > 0) {
              this.listOfData = response;
              this.copylistOfData = this.listOfData;
              this.adsCount = response.length;
            } else {
              this.listOfData = [];
            }
          });
    } else {
      this.appService
        .getAllCreatives(this.reportType)
        .subscribe((data: any) => {
          let response: ArtifactResponse[] = data.ads;
          if (response.length > 0) {
            this.listOfData = response;
            this.copylistOfData = this.listOfData;
            this.adsCount = response.length;
          } else {
            this.listOfData = [];
          }
        });
    }
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
      this.updateCheckedSet(item.metadata.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ArtifactResponse[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.metadata.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.metadata.id)
      ) && !this.checked;
  }

  viewReport = (id: string) => {
    this.router.navigate(["reports", id]);
  };
  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const milliseconds = currentDate
      .getMilliseconds()
      .toString()
      .padStart(3, "0");
    const timezoneOffset = currentDate.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60))
      .toString()
      .padStart(2, "0");
    const timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60)
      .toString()
      .padStart(2, "0");
    const timezoneSign = timezoneOffset < 0 ? "+" : "-";

    this.currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  }

  getDiff() {
    const t1 = this.timeperiod1;
    const t2 = new Date(this.currentDate);

    const timeDiff = Math.abs(t1.getTime() - t2.getTime());
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    this.timeperiod = daysDiff;
  }

  popup = (id: string) => {
    let className = "report-details-modal";
    this.dynamicServiceModal.createComponentModal(
      "",
      DisclaimerComponent,
      this.viewContainerRef,
      { data: id, value: "creative" },
      className
    );
  };

  delete(artifactId: string, index: number) {
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
        this.deleteCreative(artifactId, index);
      },
      nzCancelText: "No",
      nzOnCancel: () => true,
    });
  }

  deleteCreative(artifactId: string, index: number) {
    this.appService.deleteCreatives(artifactId).subscribe({
      next: (data: any) => {
        console.log("deleteCreative", data, artifactId);

        this.listOfData = this.listOfData.filter((_, i) => i !== index);
        for (let i = 0; i < this.copylistOfData.length; i++) {
          const element = this.copylistOfData[i];
          if (element.metadata.id == artifactId) {
            this.copylistOfData.splice(i, 1);
            console.log("deleteCreative found", i, artifactId);
            break;
          }
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.modal.success({
          nzTitle: "Success",
          nzContent: "Creative deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {},
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
}
