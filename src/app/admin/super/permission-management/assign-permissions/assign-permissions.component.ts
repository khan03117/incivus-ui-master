import { Component, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-assign-permissions",
  templateUrl: "./assign-permissions.component.html",
  styleUrls: ["./assign-permissions.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class AssignPermissionsComponent {
  roleName: string = "Super admin";
  assignPermissionsForm = new FormGroup({
    manageCreatives: new FormControl<any>([
      { label: "Upload Creatives", value: "uploadCreatives", selected: true },
      { label: "Analyze Creatives", value: "analyzeCreatives" },
      { label: "Delete Creatives", value: "deleteCreatives" },
    ]),
    metrics: new FormControl<any>([
      {
        label: "Recall Score (required for Creative Effectiveness Score)",
        value: "recallScore",
        selected: true,
      },
      { label: "Attention", value: "attention" },
      {
        label: "Cognitive Load (required for Creative Effectiveness Score)",
        value: "cognitiveLoad",
      },
      {
        label:
          "Ad Copy Effectiveness (required for Creative Effectiveness Score)",
        value: "adCopy",
      },
      { label: "Brand Compliance", value: "brandCompliance" },
      { label: "Emotions", value: "emotions" },
      { label: "Digital accessibility", value: "digtalAccessibility" },
    ]),
    report: new FormControl<any>([
      { label: "View full report", value: "viewFullReport", selected: true },
      { label: "Download full report", value: "downloadFullReport" },
      { label: "View summary page only", value: "viewSummary" },
      { label: "Download summary page only", value: "downloadSummary" },
      { label: "View A/B test report", value: "ViewABTestReport" },
      { label: "Download A/B test report", value: "downloadABtestReport" },
      { label: "Edit Report", value: "editReport" },
    ]),
    settings: new FormControl<any>([
      { label: "Service Request", value: "serviceRequest", selected: true },
    ]),
  });
}
