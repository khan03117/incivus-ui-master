import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  Component,
  Pipe,
  PipeTransform,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppServices } from "src/app/_services/app.service";
import { FileService } from "src/app/_services/file.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: "app-campaign-details-2",
  templateUrl: "./campaign-details-2.component.html",
  styleUrls: ["./campaign-details-2.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class CampaignDetails2Component implements PipeTransform {
  campaign: any;
  campaignId: string;
  adAccountId: string;
  adAccount: any;
  flightType: string = "";
  creatives: any = [];
  filterList: string = "all";
  creativeData: any = [];

  breadcrumb: any = [];
  client: any = {};
  user: any = {};
  isAnalyze: boolean = false;

  sIncAdmin: boolean = false;
  isLoading: boolean = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<String>();
  infoMsg: string =
    "You can create company setup and come back to edit the same as required.";
  errorMsg: string = "";

  insights: any;
  previousInsights: any;
  ads: any[] = [];
  adsData: any[] = [];
  searchText = "";
  transform(value: number): string {
    if (value < 0) {
      return `-₹${Math.abs(value).toFixed(2)}`;
    } else {
      return `₹${value.toFixed(2)}`;
    }
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: AppServices,
    private fileService: FileService,
    private modal: NzModalService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log("params", params);
      this.campaignId = params["campaign_id"];
      this.adAccountId = params["account_id"];
      this.flightType = params["flight_type"];
    });
    this.getInsights();
  }
  async analyseAds(ad: any, index: number) {
    this.errorMsg = "";
    // TODO, analyse
    // ad.analyse = !ad.analyse ?? true;
    if (ad?.creative?.image_url != null) {
      // this.imageUrl = ad?.creative?.image_url;
      this.downloadImage(ad?.creative?.image_url, ad, index);
    } else if (ad?.creative?.object_story_spec?.video_data?.video_id != null) {
      this.getVideo(
        ad?.creative?.object_story_spec?.video_data?.video_id,
        ad,
        index
      );
    }
  }
  reanalyze(ad: any, index: number): void {
    console.log("reanalyze", ad?.artifact?.metadata?.id);
    if (!ad?.artifact?.metadata?.id) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "We are unable to reinitiate the analysis now.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {},
      });
    } else {
      this.service.retryAnalyzeCreative(ad?.artifact?.metadata?.id).subscribe({
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
              this.ads[index].artifact = { metadata: { status: "10" } };
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
  }

  getAnalyzeStatusLabel(status: any): string {
    let result = "Analyze";
    if (status == null) return result;
    switch (status.toString()) {
      case "0":
        result = "Not analyzed";
        break;
      case "10":
      case "90":
        result = "In progress";
        break;
      case "50":
        result = "Failed";
        break;
      case "100":
        result = "Completed";
        break;
      default:
        result = "Analyze";
        break;
    }

    return result;
  }

  downloadImage(imageUrl: string, ad: any, index: number) {
    console.log("imageUrl", imageUrl);
    this.http
      .get(imageUrl, { responseType: "blob", withCredentials: false })
      .subscribe({
        next: (response) => {
          // Extract file name from the URL
          const urlSegments = imageUrl.split("/");
          let fileName =
            urlSegments[urlSegments.length - 1] || "downloaded_image.png";
          // Remove query parameters if present
          fileName = fileName.split("?")[0];

          // Create a File from the Blob response
          const file = new File([response], fileName, { type: response.type });

          let formData = this.getFormData(file, "image", ad);
          this.createAd(formData, index);
        },
        error: (error) => {
          console.error("Error downloading image:", error);
          this.errorMsg = "Uh ho! Facing an issue in fetching the image.";
        },
      });
  }
  getVideo(videoId: string, ad: any, index: number) {
    this.service
      .getFacebookVideo(this.adAccountId, videoId)
      .subscribe((response: any) => {
        console.log("getVideo", response);
        if (response?.source != null)
          this.downloadVideo(response.source, ad, index);
        else {
          // TODO - handle error
        }
      });
  }
  replaceFnaPattern(url: string) {
    // const pattern = 'fbom3-1.fna';
    const pattern = /[a-z]+\d+-\d+\.fna/;
    return url.replace(pattern, "xx");
  }
  replaceVideoPattern(url: string) {
    const pattern = "scontent";
    return url.replace(pattern, "video");
  }

  downloadVideo(videoUrl: string, ad: any, index: number) {
    console.log("videoUrl", videoUrl);
    var url = this.replaceFnaPattern(videoUrl);
    url = this.replaceVideoPattern(url);

    this.http
      .get(url, { responseType: "blob", withCredentials: false })
      .subscribe({
        next: (response) => {
          console.log("response:" + response);

          // Extract file name from the URL
          const urlSegments = videoUrl.split("/");
          let fileName =
            urlSegments[urlSegments.length - 1] || "downloaded_video.mp4";
          // Remove query parameters if present
          fileName = fileName.split("?")[0];

          // Create a File from the Blob response
          const file = new File([response], fileName, { type: response.type });

          let formData = this.getFormData(file, "video", ad);
          this.createAd(formData, index);
        },
        error: (error) => {
          console.error("Error downloading video:", error);
          this.errorMsg = "Uh ho! Facing an issue in fetching the video.";
        },
      });
  }

  getFormData(file: File, artifactType: string, ad: any): any {
    let formData = new FormData();
    formData.append("artifactType", artifactType);
    formData.append("brand", this.adAccount?.brand);
    formData.append("multipartFile", file);
    formData.append("analyze", "true");
    formData.append("phase", this.flightType);
    formData.append("title", ad?.name?.substring(0, 25));
    formData.append("groupName", this.campaign?.name);
    formData.append("campaignId", this.campaign?.id);
    formData.append("creativeId", ad?.creative?.id);
    formData.append("adAccountId", this.adAccountId);
    console.log("formData", formData);

    return formData;
  }
  createAd(formData: FormData, index: number): void {
    this.service.createAd(formData).subscribe({
      next: (data: any) => {
        console.log("createAd response:", data, index);
        this.ads[index].artifact = { metadata: { status: "10" } };

        if (data.status.toLowerCase() === "success") {
          let content =
            "We are analyzing the creative now. Check back in few minutes for the report.";
          this.modal.success({
            nzTitle: "Success",
            nzContent: content,
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
        } else {
          this.errorMsg = "Unable to upload creative, please try again later";
          window.scrollTo(0, 0);
        }
      },
      error: (err) => {
        let type =
          formData.get("artifactType") == "image" ? "display" : "video";
        if (err.error && err.error.errorCode === "QUOTA_EXCEEDED") {
          this.errorMsg = `You can analyze upto ${
            err?.error?.message ?? "0"
          } ${type} ads only.`;
        } else if (err.error && err.error.errorCode === "NO_PERMISSION") {
          this.errorMsg = `Uh ho! You do not have ther permission to upload ${type} ads.`;
        } else {
          this.errorMsg = "Unable to upload creative, please try again later";
        }
        window.scrollTo(0, 0);
      },
    });
  }
  expandAd(ad: any) {
    ad.expanded = !ad.expanded ?? true;
  }
  getInsights() {
    this.service
      .getCampaignDetails(this.adAccountId, this.campaignId)
      .subscribe({
        next: (response: any) => {
          console.log("getInsights:", response, this.flightType);
          console.log("flightType:", this.flightType);

          this.campaign = response.campaign;
          this.insights = response?.insight;
          this.previousInsights = response?.previousInsight;
          this.ads = response?.ads ?? [];
          this.adsData = [...response?.ads];
          this.adAccount = response?.ad_account;
          this.breadcrumb = [
            {
              name: this.flightType,
              link: `/creatives/${this.flightType}/list`,
            },
            {
              name: this.campaign?.name,
              link: null,
            },
          ];
        },
        error: (error) => {
          console.error("Request failed:", error);
          this.errorMsg =
            "We are facing some glitches, please try again later.";
        },
      });
  }
  filter(): void {
    if (this.searchText === "") {
      this.ads = this.adsData;
    } else {
      this.ads = [];
      for (let ad of this.adsData) {
        console.log(ad["name"]);
        if (
          ad["name"]
            .toString()
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        ) {
          this.ads.push(ad);
        }
      }
    }
    console.log(
      "filter:",
      this.searchText,
      this.adsData.length,
      this.ads.length
    );
  }

  editClient(clientId: String): void {
    // this.router.navigate(["client", "manage", clientId]);
  }
  confirmDeleteAll(id: string) {}
  onItemChecked(id: string, checked: boolean): void {
    // this.updateCheckedSet(id, checked);
    // this.refreshCheckedStatus();
  }
}
