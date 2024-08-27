import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { EventData } from "src/app/_shared/event.class";
import { deepCopy } from "@angular-devkit/core/src/utils/object";

@Component({
  selector: "app-feature-access",
  templateUrl: "./feature-access.component.html",
  styleUrls: ["./feature-access.component.less"],
})
export class FeatureAccessComponent implements OnInit {
  @Input() featuresIn: any;
  @Input() client: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  featureError: string = "";
  features: any;
  savedFeatureAccess: any = null;

  constructor(
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.savedFeatureAccess = deepCopy(this.featuresIn);
    this.features = deepCopy(this.featuresIn);
  }

  // Feature Access Modal Save Button
  handleSave(): void {
    this.featureError = this.validateFeatureAccess();
    console.log("handleSave error", this.featureError);

    if (this.featureError) {
      document.getElementsByTagName("nz-modal-container")[0].scroll(0, 0);
      return;
    }

    this.savedFeatureAccess = deepCopy(this.features);
    console.log("handleSave close emit", this.savedFeatureAccess);
    this.close.emit(this.savedFeatureAccess);
    // var value = {
    //   data: { ...this.data },
    //   toggle: this.featureServiceRequest,
    // };
    // TODO
    // this.eventBusService.emit(new EventData("toggle_service_request", value));
  }

  handleActiveChange(field: any, event: any) {
    console.log(
      "handleActiveChange",
      field,
      this.features.inFlight.imageAd.isAnalyze,
      event
    );
    this.features.inFlight.imageAd.isAnalyze = event;
    // features.inFlight.imageAd.isAnalyze;
    // this.cdr.detectChanges();
  }

  validateFeatureAccess(): string {
    if (this.features.preFlight.isAvailable) {
      if (this.features.imageAd.isAvailable) {
        if (this.features.imageAd.adLimit < 1) {
          return "Please provide a value for number of image ads that are allowed for evaluation in pre-flight.";
        }
      }
      if (this.features.videoAd.isAvailable) {
        if (this.features.videoAd.adLimit < 1) {
          return "Please provide a value for number of video ads that are allowed for evaluation in pre-flight.";
        }
      }
    } else {
      this.features.imageAd.isAvailable = false;
      this.features.videoAd.isAvailable = false;
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
      return "Please select at least one feature for any of the phases.";
    }
    if (this.features.inFlight.isAvailable) {
      if (
        this.features.inFlight.imageAd.isAnalyze &&
        this.features.inFlight.imageAd.adLimit <= 0
      ) {
        return "Please provide a value for number of display ads that are allowed for evaluation in in-flight.";
      }
      if (
        this.features.inFlight.videoAd.isAnalyze &&
        this.features.inFlight.videoAd.adLimit <= 0
      ) {
        return "Please provide a value for number of video ads that are allowed for evaluation in in-flight.";
      }
    }
    if (this.features.postFlight.isAvailable) {
      if (
        this.features.postFlight.imageAd.isAnalyze &&
        this.features.postFlight.imageAd.adLimit <= 0
      ) {
        return "Please provide a value for number of display ads that are allowed for evaluation in post-flight.";
      }
      if (
        this.features.postFlight.videoAd.isAnalyze &&
        this.features.postFlight.videoAd.adLimit <= 0
      ) {
        return "Please provide a value for number of video ads that are allowed for evaluation in post-flight.";
      }
    }
    console.log(
      `isBothAdmin:${this.client?.isBothAdmin} isClientAdmin:${
        this.client?.isClientAdmin
      } inFlight:${this.features.inFlight.isAvailable} postFlight:${
        this.features.postFlight.isAvailable
      } op:${
        (this.client?.isBothAdmin != true ||
          this.client?.isClientAdmin == true) &&
        (this.features.inFlight.isAvailable ||
          this.features.postFlight.isAvailable)
      }`
    );

    if (
      this.client?.isClientAdmin == true &&
      (this.features.inFlight.isAvailable ||
        this.features.postFlight.isAvailable)
    ) {
      return "Please note, this Client has access to in-flight and post-flight features that would require channel setup. Please add Client side admin and allow access to Incivus admin.";
    }
    return "";
  }

  toggleFeaturePreFlight(): void {
    this.features.preFlight.isAvailable =
      !this.features.preFlight.isAvailable ?? true;
    console.log("toggleFeaturePreFlight", this.features.preFlight);
  }
  toggleFeatureInFlight(): void {
    this.features.inFlight.isAvailable =
      !this.features.inFlight.isAvailable ?? true;
    console.log("toggleFeatureInFlight", this.features.inFlight);
  }

  handleClose(): void {
    if (this.savedFeatureAccess) {
      this.features = deepCopy(this.savedFeatureAccess);
    } else {
      this.features = {
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
      };
    }
    console.log("handleSave close emit void");
    this.close.emit();
  }
}
