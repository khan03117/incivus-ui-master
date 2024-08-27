import { Component, ViewEncapsulation ,ViewContainerRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import {DynamicModalComponentService}from 'src/app/common/services/dyamic-modal-component.service';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
 

@Component({
  selector: 'app-creative-details',
  templateUrl: './creative-details.component.html',
  styleUrls: ['./creative-details.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreativeDetailsComponent {
  warningMsg: string = "";
  alertType: string = "";
  artifactId:string = '';
  loading: boolean = true;
  primaryButton: string = '';
  creatives: any = {};
  isAnalyze: boolean = false;
  isReport: boolean = false;
  client: any = {};
  user: any = {};
  isIncAdmin: boolean = false;
  isTrialUser: boolean = false;
  createdBy: string = "";
  currentDate: string = "";
  timeperiod = 100;
  timeperiod1: Date;

 
  breadcrumb: any = [
    {
      name: "Creatives",
      link: "/creatives/pre-flight/list",
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AppServices,
    private modal: NzModalService,
    private storage: StorageService,
    private viewContainerRef: ViewContainerRef,
    private dynamicServiceModal: DynamicModalComponentService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.artifactId = this.route.snapshot.params["artifactId"];

      if (this.artifactId) {
        this.user = this.storage.getUser();
        this.client = this.user.client;
        if(this.user.disclaimerAccDate!=null || this.user.disclaimerAccDate!="null"){
          this.getCurrentDate();
          this.timeperiod1 = new Date(this.user.disclaimerAccDate);
          this.getDiff();
        } else {
          this.timeperiod = 100;
        }
        if (this.user && this.user.roles.includes("INCIVUS_ADMIN")) {
          this.isIncAdmin = true;
        }
        if (this.user && this.user.roles.includes("TRIAL_USER")) {
          this.isTrialUser = true;
        }
        this.isAnalyze = this.isIncAdmin || this.isTrialUser || (this.user.permission && this.user.permission.isAnalyze);
        this.loadArtifact();
      } else {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "We didnt find what you are looking for. Please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["creatives", "pre-flight", "list"]);
          },
        });
      }
    }, 10);
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  //this.timeperiod=100;
  loadArtifact(): void {
    this.service.getCreativeDetails(this.artifactId).subscribe({
      next: (data: any) => {
        if (data) {
          this.creatives = data;
          if (this.breadcrumb.length === 1) {
            this.breadcrumb.push({name: this.capitalizeFirstLetter(this.creatives.metadata.title), link: null, bold: true});
          }
          switch (this.creatives.metadata.status.toString()) {
            case '0' :
              this.warningMsg = "You can analyze a creative any time after its uploaded in the system. This ad is not analyzed yet.";
              this.alertType = "warning";
              this.primaryButton = "analyze";
              break;
            case '10' :
              this.warningMsg = "The creative is currently being analyzed. Will let you know once the reports are ready.";
              this.alertType = "warning";
              this.primaryButton = "";
              break;
            case '50' :
              this.warningMsg = "Your creative analysis has failed. You can try analyzing it again."
              this.alertType = "error";
              this.primaryButton = "reanalyze";
              break
            case '100' :
              this.warningMsg = "The analysis of your creative is succesfully completed. You can view the report."
              this.alertType = "info";
              this.primaryButton = "report";
              if (!(this.isIncAdmin || this.isTrialUser)) {
                if( this.creatives.metadata.type === 'image') {
                  if (this.client.featureAccess.imageAd.analyze.viewReport) {
                    if( this.user.permission.viewSummaryPage || this.user.permission.viewFullReport ) {
                      this.isReport = true
                    }
                  }
                } else {
                  if (this.client.featureAccess.videoAd.analyze.viewReport) {
                    if( this.user.permission.viewSummaryPage || this.user.permission.viewFullReport ) {
                      this.isReport = true;
                    }
                  }
                }
              } else {
                this.isReport = true;
              }
              break;
            case '90':
              if (this.isIncAdmin || this.isTrialUser) {
                this.warningMsg = "The analysis of your creative is succesfully completed. You can view the report."
                this.alertType = "info";
                this.primaryButton = "report";
                this.isReport = true;
              } else {
                this.warningMsg = "The creative is currently being analyzed. Will let you know once the reports are ready.";
                this.alertType = "warning";
                this.primaryButton = "";
                break;
              }
              break;
          }
          this.loading = false;
        } else {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: "We didnt find what you are looking for. Please try again later",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.router.navigate(["creatives", "pre-flight", "list"]);
            },
          });
        }
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "We didnt find what you are looking for. Please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["creatives", "pre-flight", "list"]);
          },
        });
      },
    });
  }

  cancel = () => {
    this.router.navigate(["creatives", "pre-flight", "list"]);
  };

  viewReport = (id: string) => {
    this.router.navigate(['reports', id]);
  }

  analyze = () => {
    this.service.analyzeCreative(this.creatives.metadata.id).subscribe({
      next: (data: any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "We are analyzing the creative now. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.loadArtifact();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are unable to analyze it, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.loadArtifact();
          }
        });
      }
    });
  }

  reanalyze = () => {
    this.service.retryAnalyzeCreative(this.creatives.metadata.id).subscribe({
      next: (data: any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "We have reinitiated the analysis. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.loadArtifact();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are unable to reinitiate the analysis now, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.loadArtifact();
          }
        });
      }
    });
  }
  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
    const timezoneOffset = currentDate.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, '0');
    const timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
    const timezoneSign = timezoneOffset < 0 ? '+' : '-';

    this.currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  }

  getDiff() {
    const t1 = this.timeperiod1;
    const t2 = new Date(this.currentDate);

    const timeDiff = Math.abs(t1.getTime() - t2.getTime());
    const daysDiff=(timeDiff/(1000*60*60*24));
    this.timeperiod = daysDiff;
  }

  popup = (id: string) => {
    let className = 'report-details-modal';
    this.dynamicServiceModal.createComponentModal('', DisclaimerComponent, this.viewContainerRef, {data:id, value:'creative'}, className)
  }
}
 
