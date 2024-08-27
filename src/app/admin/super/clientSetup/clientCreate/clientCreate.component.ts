import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { EventData } from "src/app/_shared/event.class";
import { AppServices } from "src/app/_services/app.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { deepCopy } from "@angular-devkit/core/src/utils/object";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-client-create",
  templateUrl: "./clientCreate.component.html",
  styleUrls: ["./clientCreate.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientCreateComponent {
  onServiceUserClose(value: any) {
    console.log("onServiceUserClose", value);
    this.serviceUser = null;
  }
  onServiceUserCancel() {
    this.serviceUser = null;
  }
  onServiceUserSave(event: any) {
    this.serviceUser = null;
    console.log("onServiceUserSave", event);
  }
  @Input() public data: any;
  companyForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    status: new FormControl(""),
    noOfUser: new FormControl(""),
    oversight: new FormControl(false),
  });
  features: any = {
    serviceRequest: false,
    imageAd: {
      isAvailable: false,
      adLimit: 0,
      isAnalyze: false,
      analyze: {
        viewReport: false,
        downloadReport: false,
      },
      isABTest: false,
      abTest: {
        viewReport: false,
        downloadReport: false,
      },
      isAIModels: false,
      aiModels: {
        recall: false,
        attention: false,
        adCopy: false,
        music: false,
        humanPresence: false,
      },
    },
    videoAd: {
      isAvailable: false,
      adLimit: 0,
      isAnalyze: false,
      analyze: {
        viewReport: false,
        downloadReport: false,
      },
      isABTest: false,
      abTest: {
        viewReport: false,
        downloadReport: false,
      },
      isAIModels: false,
      aiModels: {
        recall: false,
        attention: false,
        adCopy: false,
        music: false,
        humanPresence: false,
      },
    },
    preFlight: {
      isAvailable: false,
    },
    inFlight: {
      imageAd: {
        isAvailable: false,
        adLimit: 0,
        isAnalyze: false,
        analyze: {
          viewReport: false,
          downloadReport: false,
        },
        isABTest: false,
        abTest: {
          viewReport: false,
          downloadReport: false,
        },
        isAIModels: false,
        aiModels: {
          recall: false,
          attention: false,
          adCopy: false,
          music: false,
          humanPresence: false,
        },
      },
      videoAd: {
        isAvailable: false,
        adLimit: 0,
        isAnalyze: false,
        analyze: {
          viewReport: false,
          downloadReport: false,
        },
        isABTest: false,
        abTest: {
          viewReport: false,
          downloadReport: false,
        },
        isAIModels: false,
        aiModels: {
          recall: false,
          attention: false,
          adCopy: false,
          music: false,
          humanPresence: false,
        },
      },
    },
    postFlight: {
      imageAd: {
        isAvailable: false,
        adLimit: 0,
        isAnalyze: false,
        analyze: {
          viewReport: false,
          downloadReport: false,
        },
        isABTest: false,
        abTest: {
          viewReport: false,
          downloadReport: false,
        },
        isAIModels: false,
        aiModels: {
          recall: false,
          attention: false,
          adCopy: false,
          music: false,
          humanPresence: false,
        },
      },
      videoAd: {
        isAvailable: false,
        adLimit: 0,
        isAnalyze: false,
        analyze: {
          viewReport: false,
          downloadReport: false,
        },
        isABTest: false,
        abTest: {
          viewReport: false,
          downloadReport: false,
        },
        isAIModels: false,
        aiModels: {
          recall: false,
          attention: false,
          adCopy: false,
          music: false,
          humanPresence: false,
        },
      },
    },
  };
 
  featureAccessSave: boolean = false;
  featureAd: string = "imageAd";
  featureAccess: string = "";
  isFeatureAccessVisible = false;
  formError: string = "";
  unBlur: boolean = false;
  nouBlur: boolean = false;
  client: any;
  serviceUser: any;
  userForm: FormGroup<any>;
  blurFN: any;
  blurLN: any;
  blurEmail: any;

  constructor(
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService,
    private appService: AppServices,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data);
      if (this.data && this.data.client) {
        this.client = this.data.client;
        this.companyForm = this.formBuilder.group({
          name: [
            this.client.companyName,
            [Validators.required, Validators.minLength(3)],
          ],
          status: [this.client.status, Validators.required],
          noOfUser: [this.client.noOfUser, Validators.required],
          oversight: [this.client.oversight, Validators.required],
        });
        if (this.client.featureAccess.inFlight == null)
          this.client.featureAccess.inFlight = {
            videoAd: { analyze: {} },
            imageAd: { analyze: {} },
          };
        if (this.client.featureAccess.postFlight == null)
          this.client.featureAccess.postFlight = {
            videoAd: { analyze: {} },
            imageAd: { analyze: {} },
          };
        let features = deepCopy(this.client.featureAccess);
        if (features.preFlight == null || features.preFlight == undefined) {
          features.preFlight = {
            isAvailable:
              features.videoAd.isAvailable || features.imageAd.isAvailable,
          };
        }
        this.features = features;
        this.featureAccess = this.getFeatureAccessString();
      } else {
        this.companyForm = this.formBuilder.group({
          name: ["", [Validators.required, Validators.minLength(3)]],
          status: ["inactive", Validators.required],
          noOfUser: [1, Validators.required],
          oversight: [false, Validators.required],
        });
      }
      this.features.imageAd.analyze.downloadReport=false;
      this.features.imageAd.abTest.downloadReport=false;
      this.features.videoAd.analyze.downloadReport=false;
      this.features.videoAd.abTest.downloadReport=false;
    }, 10);

    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        console.log("event received", action);
        if (action.name === "add_service_user") {
          this.serviceUser = action.value;
        }
      });
  }
  private ngUnsubscribe = new Subject<void>();

  get f(): { [key: string]: AbstractControl } {
    return this.companyForm.controls;
  }

  getFeatureAccessString(): string {
    let list = [];
    if (
      this.features.preFlight.isAvailable ||
      this.features.imageAd.isAvailable ||
      this.features.videoAd.isAvailable
    ) {
      list.push("Pre-flight");
    }
    if (this.features.inFlight.isAvailable) {
      list.push("In-flight");
    }
    if (this.features.postFlight.isAvailable) {
      list.push("Post-flight");
    }
    if (this.features.serviceRequest) {
      list.push("Service Request");
    }
    return list.join(", ");
  }

  handleClose(data: any) {
    console.log("handleClose:", data);

    if (data != null) {
      if (data.preFlight == null || data.preFlight == undefined) {
        data.preFlight = { isAvailable: true };
      }
      this.features = data;

      this.featureAccess = this.getFeatureAccessString();
    }
    this.isFeatureAccessVisible = false;
  }

  changeStatus(): void {
    this.eventBusService.emit(
      new EventData("company_status_change", this.companyForm.value["status"])
    );
  }
  toggleFeatureAccessModal(): void {
    this.isFeatureAccessVisible = !this.isFeatureAccessVisible;
  }

  log(evt: any): void {
    // alert('hi');
  }

  saveProgress(step: string): void {
    this.eventBusService.emit(new EventData("company_form_error", ""));
    if (this.companyForm.status.toLowerCase() === "invalid") {
      this.formError =
        "Oops! You might have left one or more mandatory fields empty. Please cross check once and add the necessary information.";
      this.eventBusService.emit(
        new EventData("company_form_error", this.formError)
      );
      return;
    }

    if (
      !(
        this.features.imageAd.isAvailable ||
        this.features.videoAd.isAvailable ||
        (this.features.inFlight.isAvailable &&
          (this.features.inFlight.videoAd.isAnalyze ||
            this.features.inFlight.imageAd.isAnalyze)) ||
        (this.features.postFlight.isAvailable &&
          (this.features.postFlight.videoAd.isAnalyze ||
            this.features.postFlight.imageAd.isAnalyze)) ||
        this.features.serviceRequest
      )
    ) {
      this.formError = "Please select feature access for the client";
      this.eventBusService.emit(
        new EventData("company_form_error", this.formError)
      );
      return;
    }

    this.eventBusService.emit(new EventData("company_form_error", ""));
    this.formError = "";

    if (this.client) {
      let trialToActive = false;
      let companyData = this.companyForm.value;
      if (
        this.client.status === "trial" &&
        companyData["status"] === "active"
      ) {
        trialToActive = true;
      }
      companyData["featureAccess"] = this.features;
      companyData["id"] = this.client.id;
      companyData["isClientAdmin"] = this.client.isClientAdmin;
      this.appService.editClient(companyData).subscribe({
        next: (data) => {
          this.client = data;
          if (step.toLowerCase() === "continue") {
            this.toggleAccordion(this.client);
          } else if (trialToActive) {
            this.eventBusService.emit(
              new EventData("trialToActive", this.client)
            );
          }
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.eventBusService.emit(
              new EventData("company_form_error", err.error.message)
            );
          } else {
            this.eventBusService.emit(
              new EventData(
                "company_form_error",
                "We are facing some glitches, please try again later."
              )
            );
          }
        },
      });
    } else {
      let companyData = this.companyForm.value;
      companyData["featureAccess"] = this.features;
      this.appService.saveClient(companyData).subscribe({
        next: (data) => {
          this.client = data;
          if (step.toLowerCase() === "continue") {
            this.toggleAccordion(this.client);
          } else {
             this.eventBusService.emit(
               new EventData("company_updated", this.client)
             );
            this.modal.success({
              nzTitle: "Success",
              nzContent: "Information saved succesfully.",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {},
            });
          }
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.eventBusService.emit(
              new EventData("company_form_error", err.error.message)
            );
          } else {
            this.eventBusService.emit(
              new EventData(
                "company_form_error",
                "We are facing some technical issue, please try again later."
              )
            );
          }
        },
      });
    }
  }

  toggleAccordion(client: any): void {
    this.eventBusService.emit(new EventData("company_saved", client));
  }
}
