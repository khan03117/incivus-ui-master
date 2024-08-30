import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecallContainerComponent } from '../recall/recall-container/recall-container.component';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { CognitiveLoadComponent } from '../cognitive-load/cognitive-load.component';
import { EffectivenessContainerComponent } from '../effectiveness/effectiveness-container/effectiveness-container.component';
import { EmotionsComponent } from '../emotions/emotions.component';
import { DigitalAccessibilityComponent } from '../digital-accessibility/digital-accessibility.component';
import { BrandsContainerComponent } from '../brands/brands-container/brands-container.component';
import { EmotionalIntensityComponent } from '../emotional-intensity/emotional-intensity.component';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Range } from 'src/app/common/models/range.model';
import { ThisReceiver } from '@angular/compiler';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { RuleService } from 'src/app/_services/rule.service';

declare function slider(sliderVal: any, ele: any): any;

const STROKE_COLOR: any = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ReportContainerComponent {
  score: string = '';
  user: any = {};
  client: any = {};
  scoreClass: string = '';
  scoreClass2: string = '';
  scores: string[] = [];
  isVideoReport = true;
  isLoading: boolean = true;
  artifactId: string = "";
  creative: any = {};
  summary: any = {};
  isIncAdmin: boolean = false;
  isTrialUser: boolean = false;
  runTime: number = 0;
  range: any = {};
  recallScore: string = '';
  cognitiveScore: string = '';
  adcopyEffScore: string = '';
  imageReport: any = {};
  emotionDescription: string = "";
  recallData: any = null;
  cognitiveData: any = null;
  adCopyData: any = null;
  brandCuesData: any = null;
  emotionData: any = null;
  digitalAccReport: any = null;
  showFullReport: boolean = true;
  showRecall: boolean = true;
  showAdCopy: boolean = true;
  showBrandCues: boolean = true;
  showAttention: boolean = true;
  showCognitive: boolean = true;
  showDigitalAcc: boolean = true;
  showEmotion: boolean = true;
  reportStatus: string = '';
  recallIndex: number = 0;
  cognitiveIndex: number = 0;
  adCopyIndex: number = 0;
  digitalAccScore: string = '';
  scoreText: string = '';
  scoreText2: string = '';
  ruleResponse: any = {};
  breadcrumb: any = [
    {
      name: "Reports",
      link: "/reports/list"
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private service: AppServices,
    private storage: StorageService,
    private modal: NzModalService,
    private eventBusService: EventBusService,
    private ruleService: RuleService
  ) {
  }

  onMetadata(e: any) {
    try {
      if (e.target && e.target.duration) {
        let time = Math.floor(e.target.duration);
        let minutes = Math.floor(time / 60);
        let minStr = minutes < 10 ? '0' + minutes : '' + minutes;
        let seconds = time - minutes * 60;
        let secStr = seconds < 10 ? '0' + seconds : '' + seconds;
        // this.runTime = minStr + ":" + secStr;
        this.runTime = time;
      } else {
        this.runTime = 0;
      }
    } catch (e) {
      this.runTime = 0;
    }
  }

  ngOnInit(): void {
    this.artifactId = this.route.snapshot.params["artifactId"];
    this.ruleService.getRuleOnReport('9950e65b-9ab5-405e-bae3-1e86a236f6bb', this.isVideoReport ? 'image' : 'image').subscribe(
      (data) => {
        this.ruleResponse = data;
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    )
    setTimeout(() => {
      this.eventBusService.emit(new EventData('loader', 'startFull'));
      this.range = Range;
      this.user = this.storage.getUser();
      if (this.user && this.user.roles) {
        if (this.user.roles.includes("INCIVUS_ADMIN")) {
          this.isIncAdmin = true;
          this.breadcrumb[0].name = "Pre-flight";
          this.breadcrumb[0].link = "/creatives/list/pre-flight";
        }
        if (this.user.roles.includes("TRIAL_USER")) {
          this.isTrialUser = true;
        }
        this.client = this.user && this.user.client ? this.user.client : null;
      }
      // this.artifactId = "3baec6d9-9a6e-4add-ae6d-0d660f97ec68";

      this.getMetadata();
    }, 10);
  }

  showErrorModal(errorMsg: string, redirect: boolean) {
    this.modal.error({
      nzTitle: "Error",
      nzContent: errorMsg,
      nzClassName: "small-modal",
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOnOk: () => {
        if (redirect) {
          if (this.isIncAdmin) {
            this.router.navigate(["reports", "pre-flight", "list"]);
          } else {
            this.router.navigate(['reports', "list"]);
          }
        }
      }
    });
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getMetadata(): void {
    this.service.getCreativeDetails(this.artifactId).subscribe({
      next: (data: any) => {
        if (data) {
          this.creative = data;
          if (this.creative.metadata.status < 90) {
            this.showErrorModal("Report for this ad can not be displayed as it is not analyzed or failed to analyze.", true);
          } else {
            if (!this.isIncAdmin && this.creative.metadata.status === 90) {
              this.showErrorModal("Report for this ad can not be displayed as it is not analyzed or failed to analyze.", true);
            }
          }

          if (this.creative.metadata.artifactType === 'image') {
            this.isVideoReport = false;
            if (!this.isTrialUser && !this.isIncAdmin) {
              if (!this.client.featureAccess.imageAd.analyze.viewReport) {
                this.showErrorModal("You do not have permission to view Report", true);
                return;
              }
              if (!this.user.permission.viewFullReport && !this.user.permission.viewSummaryPage) {
                this.showErrorModal("You do not have permission to view Report", true);
                return;
              }
              this.showFullReport = this.user.permission && this.user.permission.viewFullReport;
            }
            this.breadcrumb.push({ name: "Display ad report", link: null });
            this.breadcrumb.push({ name: this.capitalizeFirstLetter(this.creative.metadata.title), link: null });
          } else {
            this.isVideoReport = true;
            if (!this.isTrialUser && !this.isIncAdmin) {
              if (!this.client.featureAccess.videoAd.analyze.viewReport) {
                this.showErrorModal("You do not have permission to view Report", true);
                return;
              }
              if (!this.user.permission.viewFullReport && !this.user.permission.viewSummaryPage) {
                this.showErrorModal("You do not have permission to view Report", true);
                return;
              }
              this.showFullReport = this.user.permission && this.user.permission.viewFullReport;
            }
            this.breadcrumb.push({ name: "Video report", link: null });
            this.breadcrumb.push({ name: this.capitalizeFirstLetter(this.creative.metadata.title), link: null });
          }
          if (this.user.roles.includes("INCIVUS_ADMIN")) {
            this.isIncAdmin = true;

            this.breadcrumb[0].name = this.creative?.metadata?.phase;
            this.breadcrumb[0].link =
              "/reports/" + this.creative?.metadata?.phase + "/list";
          }

          if (this.isIncAdmin) {
            this.showAdCopy = true;
            this.showBrandCues = true;
            this.showAttention = true;
            this.showRecall = true;
            this.showFullReport = true;
            this.showCognitive = true;
            this.showDigitalAcc = true;
            this.showEmotion = true;
          } else if (this.isTrialUser) {
            this.showAdCopy = true;
            this.showBrandCues = false;
            this.showAttention = true;
            this.showRecall = true;
            this.showFullReport = true;
            this.showCognitive = true;
            this.showDigitalAcc = true;
            this.showEmotion = true;
          } else {
            this.showBrandCues = this.user.permission && this.user.permission.brandCompliance;
            this.showCognitive = this.user.permission && this.user.permission.cognitiveLoad;
            this.showDigitalAcc = this.user.permission && this.user.permission.digitalAccessibility;
            this.showEmotion = this.user.permission && this.user.permission.emotion;
          }
          if (this.creative.metadata.artifactType === 'image') {
            if (!this.isIncAdmin && !this.isTrialUser) {
              this.showRecall = false;
              if (this.client.featureAccess.imageAd.aiModels.recall) {
                if (this.user.permission && this.user.permission.recall) {
                  this.showRecall = true;
                }
              }
              this.showAttention = false;
              if (this.client.featureAccess.imageAd.aiModels.attention) {
                if (this.user.permission && this.user.permission.attention) {
                  this.showAttention = true;
                }
              }
              this.showAdCopy = false;
              if (this.client.featureAccess.imageAd.aiModels.adCopy) {
                if (this.user.permission && this.user.permission.adCopy) {
                  this.showAdCopy = true;
                }
              }
            }
            this.getImageReport();
          } else {
            if (!this.isIncAdmin && !this.isTrialUser) {
              this.showRecall = false;
              if (this.client.featureAccess.videoAd.aiModels.recall) {
                if (this.user.permission && this.user.permission.recall) {
                  this.showRecall = true;
                }
              }
              this.showAttention = false;
              if (this.client.featureAccess.videoAd.aiModels.attention) {
                if (this.user.permission && this.user.permission.attention) {
                  this.showAttention = true;
                }
              }
              this.showAdCopy = false;
              if (this.client.featureAccess.videoAd.aiModels.adCopy) {
                if (this.user.permission && this.user.permission.adCopy) {
                  this.showAdCopy = true;
                }
              }
            }
            this.getSummaryReport();
          }
        } else {
          this.showErrorModal("We didnt find what you are looking for. Please try again later", true);
        }
      },
      error: err => {
        this.showErrorModal("We didnt find what you are looking for. Please try again later", true);
      }
    });
  }

  getImageReport(): void {
    this.service.getImageReport(this.artifactId).subscribe({
      next: (data: any) => {
        let response: any = data;
        this.imageReport = response
        this.summary.videoScore = response.recallScore ? response.recallScore.toFixed(2) : 'NA';
        this.summary.cognitiveLoad = response.cognitive.cognitiveLoad ? response.cognitive.cognitiveLoad : "NA";
        this.summary.clDisplay = response.cognitive.cognitiveLoad ? (response.cognitive.cognitiveLoad * 100).toFixed(2) : "NA";
        this.summary.adCopyEffectivnessScore = response.adCopyReport.adCopyEffectivnessScore ? (response.adCopyReport.adCopyEffectivnessScore).toFixed(2) : "NA";
        this.summary.brand_compliance = response.brandCuesReport.brand_compliance ? response.brandCuesReport.brand_compliance.toFixed(2) : "NA";
        // this.summary.emotionalIntensity = this.summary.emotionalIntensity.toFixed(2);
        this.summary.optimizedForColor = response.digitalAccReport.optimizedForColor;
        this.emotionDescription = `Human facial emotions: ${response.emotionReport.humanEmotions && response.emotionReport.humanEmotions.length > 0 ? response.emotionReport.humanEmotions.join(", ") : 'NA'}  <br/> Emotions: ${response.emotionReport.colorEmotion && response.emotionReport.colorEmotion.length ? response.emotionReport.colorEmotion.join(", ") : 'NA'} <br/> Ad Copy emotions: ${response.emotionReport.adCopyEmotion && response.emotionReport.adCopyEmotion.length ? response.emotionReport.adCopyEmotion.join(", ") : 'NA'}`;
        // 😠 Angry, 😄 Happy, 😞 Sad Color
        this.score = response.adCopyReport.creativeEffectiveScore ? (response.adCopyReport.creativeEffectiveScore * 100).toFixed(2) : "0";
        this.summary.imageLink = response.imageLink;
        this.recallScore = !response.recallScore ? "NA" : (parseInt(this.summary.videoScore) < Range.RECALLL) ? "low" : (parseInt(this.summary.videoScore) < Range.RECALLH) ? "medium" : "high";
        this.cognitiveScore = !parseFloat(this.summary.cognitiveLoad) ? "NA" : (parseFloat(this.summary.cognitiveLoad) < Range.CLL) ? "low" : (parseFloat(this.summary.cognitiveLoad) >= Range.CLH) ? "high" : "medium";
        this.adcopyEffScore = !parseFloat(this.summary.adCopyEffectivnessScore) ? "NA" : (parseInt(this.summary.adCopyEffectivnessScore) < Range.ADCOPYEL) ? "low" : (parseInt(this.summary.adCopyEffectivnessScore) < Range.ADCOPYEH) ? "medium" : "high";
        if (this.summary.optimizedForColor != '') {
          this.digitalAccScore = '100';
        }
        this.recallIndex = 0;
        this.cognitiveIndex = 0;
        this.adCopyIndex = 0;
        if (this.recallScore !== 'high') {
          if (this.showRecall || this.showAttention) {
            this.recallIndex = 1;
          }
        }
        if (this.cognitiveScore !== 'medium') {
          if (this.showCognitive) {
            this.cognitiveIndex = this.recallIndex ? 2 : 1;
          }
        }
        if (this.adcopyEffScore !== 'high') {
          if (this.showAdCopy) {
            this.adCopyIndex = this.recallIndex && this.cognitiveIndex ? 3 : this.recallIndex || this.cognitiveIndex ? 2 : 1;
          }
        }

        if (this.isIncAdmin) {
          this.getStatus();
        } else {
          this.isLoading = false;
          this.eventBusService.emit(new EventData('loader', 'stopFull'));
          this.initScore();
        }
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to load report now, please try again later", false);
      }
    })
  }

  getSummaryReport(): void {
    this.service.getSummaryReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.summary = data;

        this.summary.videoScore = this.summary.videoScore ? this.summary.videoScore.toFixed(2) : "NA";
        this.summary.clDisplay = this.summary.cognitiveLoad ? (this.summary.cognitiveLoad * 100).toFixed(2) : "NA";
        this.summary.adCopyEffectivnessScore = this.summary.adCopyEffectivnessScore ? (this.summary.adCopyEffectivnessScore).toFixed(2) : "NA";
        this.summary.brand_compliance = this.summary.brand_compliance ? this.summary.brand_compliance.toFixed(2) : "NA";
        this.summary.emotialIntensity = this.summary.emotionalIntensity ? this.summary.emotionalIntensity.toFixed(2) : "NA";
        // this.summary.digitalAccessibility = this.summary.digitalAccessibility ? this.summary.digitalAccessibility.toFixed(2) : "NA";
        this.summary.optimizedForColor = this.summary.optimizedForColor;

        this.score = this.summary.creativeEffectivenessScore ? (this.summary.creativeEffectivenessScore * 100).toFixed(2) : "0";

        this.recallScore = !this.summary.videoScore ? "NA" : (parseInt(this.summary.videoScore) < Range.RECALLL) ? "low" : (parseInt(this.summary.videoScore) < Range.RECALLH) ? "medium" : "high";
        this.cognitiveScore = !this.summary.cognitiveLoad ? "NA" : (parseFloat(this.summary.cognitiveLoad) < Range.CLL) ? "low" : (parseFloat(this.summary.cognitiveLoad) >= Range.CLH) ? "high" : "medium";
        this.adcopyEffScore = !this.summary.adCopyEffectivnessScore ? "NA" : (parseInt(this.summary.adCopyEffectivnessScore) < Range.ADCOPYEL) ? "low" : (parseInt(this.summary.adCopyEffectivnessScore) < Range.ADCOPYEH) ? "medium" : "high";

        if (this.summary.optimizedForColor != '' || this.summary.optimizedForSound != '') {
          // if(this.summary.optimizedForColor!=null && this.summary.optimizedForSound!=null){
          //   this.digitalAccScore='100';
          // }else{
          //   this.digitalAccScore='50';
          // }
          console.log("Summaryy: ", this.summary);
          if (this.summary.optimizedForColor != null && this.summary.optimizedForSound != null) {
            if (this.summary.optimizedForColor == "Yes" && this.summary.optimizedForSound == "Yes") {
              this.digitalAccScore = '100';
            } else if (this.summary.optimizedForColor == "No" && this.summary.optimizedForSound == "No") {
              this.digitalAccScore = '0';
            } else {
              this.digitalAccScore = '50';
            }
          } else {
            this.digitalAccScore = '100';
          }
        }
        this.recallIndex = 0;
        this.cognitiveIndex = 0;
        this.adCopyIndex = 0;
        if (this.recallScore !== 'high') {
          if (this.showRecall || this.showAttention) {
            this.recallIndex = 1;
          }
        }
        if (this.cognitiveScore !== 'medium') {
          if (this.showCognitive) {
            this.cognitiveIndex = this.recallIndex ? 2 : 1;
          }
        }
        if (this.adcopyEffScore !== 'high') {
          if (this.showAdCopy) {
            this.adCopyIndex = this.recallIndex && this.cognitiveIndex ? 3 : this.recallIndex || this.cognitiveIndex ? 2 : 1;
          }
        }
        if (this.isIncAdmin) {
          this.getStatus();
        } else {
          this.isLoading = false;
          this.eventBusService.emit(new EventData('loader', 'stopFull'));
          this.initScore();
        }

      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch the report at this moment. Please try again later", false);
      }
    })
  }

  getStatus() {
    this.service.getStatus(this.artifactId).subscribe({
      next: (data: any) => {
        this.reportStatus = data;
        this.isLoading = false;
        this.eventBusService.emit(new EventData('loader', 'stopFull'));
        this.initScore();
      },
      error: err => {
        this.isLoading = false;
        this.eventBusService.emit(new EventData('loader', 'stopFull'));
        this.initScore();
      }
    })
  }

  getRecallReport(componentName: string, className: string) {
    this.service.getRecallReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.recallData = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, url: this.creative.url, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch recall data at this moment. Please try again later", false);
      }
    });
  }

  getcognitiveReport(componentName: string, className: string) {
    this.service.getCognitiveReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.cognitiveData = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch Cognitive Report data at this moment. Please try again later", false);
      }
    });
  }

  getAdCopyReport(componentName: string, className: string) {
    this.service.getAdCopyReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.adCopyData = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch Ad Copy data data at this moment. Please try again later", false);
      }
    });
  }

  getBrandCuesReport(componentName: string, className: string) {
    this.service.getBrandCuesReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.brandCuesData = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch Brand data at this moment. Please try again later", false);
      }
    });
  }

  getEmotionData(componentName: string, className: string) {
    this.service.getEmotionReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.emotionData = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch Emotion data at this moment. Please try again later", false);
      }
    });
  }

  getDigitalAccReport(componentName: string, className: string) {
    this.service.getDigitalReport(this.artifactId).subscribe({
      next: (data: any) => {
        this.digitalAccReport = data;
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: data }, className);
      },
      error: (err: any) => {
        this.showErrorModal("We are unable to fetch Emotion data at this moment. Please try again later", false);
      }
    });
  }

  openReportDetailsModal = (type: string) => {
    let className = 'report-details-modal';
    let componentName: any;
    switch (type) {
      case 'RECALL':
        componentName = RecallContainerComponent
        className = this.isVideoReport ? 'report-details-modal' : className;
        if (this.isVideoReport) {
          if (this.recallData) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, url: this.creative.url, data: this.recallData }, className);
          } else {
            this.getRecallReport(componentName, className);
          }
        } else {
          this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, url: this.creative.url, data: this.imageReport }, className);
        }
        break;
      case 'COGNITIVE_LOAD':
        componentName = CognitiveLoadComponent
        if (this.isVideoReport) {
          if (this.cognitiveData) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: this.cognitiveData }, className);
          } else {
            this.getcognitiveReport(componentName, className);
          }
        } else {
          this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: this.imageReport.cognitive }, className);
        }
        break;
      case 'EFFECTIVENESS':
        componentName = EffectivenessContainerComponent
        className = !this.isVideoReport ? 'report-details-modal full-width-modal' : className;
        if (this.isVideoReport) {
          if (this.adCopyData) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: this.adCopyData }, className);
          } else {
            this.getAdCopyReport(componentName, className);
          }
        } else {
          this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { isVideoReport: this.isVideoReport, data: this.imageReport.adCopyReport }, className);
        }
        break;
      case 'BRAND_COMPLIANCE':
        componentName = BrandsContainerComponent
        if (this.isVideoReport) {
          if (this.brandCuesData) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: this.brandCuesData }, className);
          } else {
            this.getBrandCuesReport(componentName, className);
          }
        } else {
          this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, data: this.imageReport.brandCuesReport }, className);
        }
        break;
      case 'EMOTIONS':
        componentName = EmotionsComponent
        this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, data: this.imageReport.emotionReport }, className);
        break;
      case 'DIGITAL_ACCESSIBILITY':
        componentName = DigitalAccessibilityComponent
        if (this.isVideoReport) {
          if (this.digitalAccReport) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: this.digitalAccReport }, className);
          } else {
            this.getDigitalAccReport(componentName, className);
          }
        } else {
          this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, data: this.imageReport.digitalAccReport }, className);
        }
        break;
      case 'EMOTIONAL_INTENSITY':
        componentName = EmotionalIntensityComponent
        if (this.isVideoReport) {
          if (this.emotionData) {
            this.dynamicModalService.createComponentModal('', componentName, this.viewContainerRef, { title: this.creative.metadata.title, isVideoReport: this.isVideoReport, runTime: this.runTime, data: this.emotionData }, className);
          } else {
            this.getEmotionData(componentName, className);
          }
        }
        break;
      default:
        break;
    }

  }

  initScore() {
    setTimeout(() => {

      this.scores.push(this.score);
      this.scores.push(this.summary.emotialIntensity);
      this.scoreClass = (parseInt(this.score) < Range.CESL) ? STROKE_COLOR.LOW : (parseInt(this.score) < Range.CESH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
      this.scoreText = this.scoreClass.toUpperCase();
      this.scoreClass2 = (parseInt(this.summary.emotialIntensity) < Range.EIL) ? STROKE_COLOR.LOW : (parseInt(this.summary.emotialIntensity) < Range.EIH) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
      this.scoreText2 = this.scoreClass2.toUpperCase();

      slider(this.scores, document.querySelectorAll('.slider-container'));
    }, 10);
  }

  buttonCallback() {
    console.log('Report button click')
  }

  preview = () => {
    this.service.preview(this.artifactId, this.creative.metadata.artifactType).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Preview successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            location.reload();
          }
        });
      },
      error: err => {
        this.showErrorModal("Unable to preview the changes, please try again later", false);
      }
    });
  }

  cancel = () => {
    this.service.cancel(this.artifactId, this.creative.metadata.artifactType).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Preview cancel successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            location.reload();
          }
        });
      },
      error: err => {
        this.showErrorModal("Unable to cancel the preview changes, please try again later", false);
      }
    });
  }

  publish = () => {
    this.modal.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you really want to publish the report for client',
      nzOkText: 'Yes',
      nzClassName: 'short-modal',
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: 'primary',
      nzOkDanger: false,
      nzOnOk: () => {
        this.publishConfirm();
      },
      nzCancelText: 'No',
      nzOnCancel: () => true
    });

  }

  publishConfirm() {
    this.service.publish(this.artifactId, this.creative.metadata.artifactType).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Published successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            location.reload();
          }
        });
      },
      error: err => {
        this.showErrorModal("Unable to publish the changes, please try again later", false);
      }
    });
  }

  revert = () => {
    this.modal.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you really want to revert the changes made to the report for client',
      nzOkText: 'Yes',
      nzClassName: 'short-modal',
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: 'primary',
      nzOkDanger: false,
      nzOnOk: () => {
        this.revertConfirm();
      },
      nzCancelText: 'No',
      nzOnCancel: () => true
    });

  }

  revertConfirm() {
    this.service.revert(this.artifactId, this.creative.metadata.artifactType).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Revert successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            location.reload();
          }
        });
      },
      error: err => {
        this.showErrorModal("Unable to revert the changes, please try again later", false);
      }
    });
  }

  getCopyLink = () => {
    this.service.getCopyLink(this.artifactId).subscribe({
      next: (data: any) => {
        const tempText = document.createElement("input") as HTMLInputElement;
        tempText.value = data[this.artifactId];
        document.body.appendChild(tempText);
        tempText.select();

        document.execCommand("copy");
        document.body.removeChild(tempText);
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Link copied successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => { }
        });
      },
      error: err => {

      }
    });
  }

  releaseReport = () => {
    this.modal.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you really want to release the report for client',
      nzOkText: 'Yes',
      nzClassName: 'short-modal',
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: 'primary',
      nzOkDanger: false,
      nzOnOk: () => {
        this.releaseConfirm();
      },
      nzCancelText: 'No',
      nzOnCancel: () => true
    });
  }

  releaseConfirm() {
    let input = {
      "artifactId": this.creative.metadata.id,
      "emailId": this.creative.metadata.emailId,
      "projectName": this.creative.metadata.title
    };

    this.service.releaseReport(input).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Report release successfully!',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.creative.metadata.status = 100;
          }
        });
      },
      error: err => {
        this.showErrorModal("Unable to release the report at this moment. Please try again later", false);
      }
    });
  }

}
