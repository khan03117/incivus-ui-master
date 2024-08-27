import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppServices } from "src/app/_services/app.service";
import { FileService } from "src/app/_services/file.service";
import { StorageService } from "src/app/_services/storage.service";

@Component({
  selector: "app-view-service-request",
  templateUrl: "./view-service-request.component.html",
  styleUrls: ["./view-service-request.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewServiceRequestComponent implements OnInit {
  adBriefReadMore() {
    this.modal.info({
      nzTitle: "Ad Brief",
      nzContent: this.serviceRequest["adBrief"],
      nzStyle: { "max-width.px": 800 },
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOnOk: () => {},
    });
  }
  id: any;
  serviceRequest: any;
  user: any;

  breadcrumb: any = [];

  assignToMe = false;
  comments: string = "";
  infoMsg: string =
    "You can create company setup and come back to edit the same as required.";
  errorMsg: string = "";

  files: File[] = [];
  uploadedFiles: string[] = [];
  isUserServiceManager: boolean = false;
  isSuperAdmin: boolean = false;
  allowEdit: boolean = false;
  textareaField = document.getElementById("myTextarea") as HTMLTextAreaElement;

  searchText = "";
  allowedExtensions = ["png", "jpeg", "jpg", "txt"];
  selectedStatus: string = "";

  constructor(
    private route: ActivatedRoute,
    private appService: AppServices,
    private storageService: StorageService,
    private fileService: FileService,
    private modal: NzModalService,
    private router: Router
  ) {}
  onAssignChange() {
    if (this.assignToMe === true) {
      this.appService.assignServiceRequest(this.serviceRequest?.id).subscribe({
        next: (data: any) => {
          this.serviceRequest.assignedTo = data?.assignedTo;
        },
        error: (err) => {
          this.assignToMe = false;
        },
      });
    } else {
      this.appService
        .unassignServiceRequest(this.serviceRequest?.id)
        .subscribe({
          next: (data) => {
            console.log("UnAssigned", data);
            this.serviceRequest = data;
          },
          error: (err) => {
            this.assignToMe = true;
            console.log("Error", err);
          },
        });
    }
  }
  onStatusChange() {
    // check if any files are added or comment is updated
    if (this.selectedStatus?.toLowerCase() == "on-hold") {
      this.upload();
    } else if (
      (this.comments != "" && this.comments != this.serviceRequest.comment) ||
      this.files.length > 0
    ) {
      // display confirmation

      this.modal.confirm({
        nzTitle: "Confirmation",
        nzContent: `Please note, marking this request complete will not allow to further edit or add information in it. Are you sure you want to mark it as ${this.selectedStatus?.toLocaleLowerCase()}?`,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {
          this.upload();
        },
        nzOnCancel: () => {
          this.selectedStatus = this.serviceRequest?.status;
        },
      });
    } else {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please either upload a file or write a comment to proceed.",
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {
          this.selectedStatus = this.serviceRequest?.status;
        },
        nzOnCancel: () => {
          this.selectedStatus = this.serviceRequest?.status;
        },
      });
    }
  }

  getFileName(url: any) {
    return this.fileService.getFileNameFromUrl(url);
  }

  adBriefMaxLength = 500;
  isReadMore = false;
  truncateAdBrief(adBrief: string): string {
    if (adBrief && adBrief.length > this.adBriefMaxLength) {
      const truncatedText = adBrief.substring(0, this.adBriefMaxLength);
      this.isReadMore = true;
      return `${truncatedText}...`;
    } else {
      this.isReadMore = false;
      return adBrief;
    }
  }

  showFullAdBrief() {
    // Implement the logic to show the full ad brief, for example, in a modal or expand the section
  }

  ngOnInit() {
    // Subscribe to the route query parameters
    this.route.params.subscribe((params) => {
      // Check if data parameter exists and parse it back to an object
      if (params["id"]) {
        this.id = params["id"];
        this.fetchServiceRequest();
      }
    });
    this.user = this.storageService.getUser();
    this.isUserServiceManager = this.user.roles.includes("SERVICE_MANAGER");
    this.isSuperAdmin = this.user.roles.includes("INCIVUS_ADMIN");
  }
  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  getFileType(url: any): string {
    return this.fileService.getFileType(url);
  }

  onFileChange(event: any) {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const extension = file.name.split(".").pop()?.toLowerCase();
      // if (extension && this.allowedExtensions.indexOf(extension) === -1) {
      //   alert("Uh! oh! the support file types are .docx, .ppt and pdf");
      //   return;
      // }
      this.files.push(selectedFiles[i]);
      console.log(selectedFiles[i]);
    }
    console.log("Number of files selected = ", this.files.length);
  }
  isImage(file: File): boolean {
    return file.type.startsWith("image");
  }
  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }
  isVideo(file: File): boolean {
    return file.type.startsWith("video");
  }
  isOtherType(file: File): boolean {
    return !file.type.startsWith("video") && !file.type.startsWith("image");
  }

  getVideoUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  getThumbnailUrl(file: File): string {
    return this.isVideo(file) ? this.getImageUrl(file) : "";
  }
  getType(file: File) {
    const str = file.type;
    const separator = "/";
    const result = str.split(separator);
    if (result[1].toUpperCase() == "PLAIN") {
      return "TEXT";
    } else if (result[1].toUpperCase() == "VND.MS-EXCEL") {
      return "XL";
    } else if (
      result[1].toUpperCase() ==
      "VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET"
    ) {
      return "XLSX";
    } else if (result[1].toUpperCase() == "MSWORD") {
      return "DOC";
    } else if (
      result[1].toUpperCase() ==
      "VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT"
    ) {
      return "DOCX";
    }
    return result[1].toUpperCase();
  }

  fetchServiceRequest(): void {
    this.appService.getServiceRequest(this.id).subscribe((response: any) => {
      this.serviceRequest = response;
      this.assignToMe = response?.assignedTo?.id == this.user?.id;
      this.uploadedFiles = this.serviceRequest.files;
      this.comments = this.serviceRequest.comment ?? "";
      this.refreshBreadcrumb();
    });
  }

  refreshBreadcrumb() {
    this.breadcrumb = [
      {
        name: "Settings",
        link: null,
      },
      {
        name: this.isUserServiceManager ? "Task list" : "Requests",
        link:
          !this.isUserServiceManager && this.isArchived()
            ? "/client/service-requests/archived"
            : "/client/service-requests/all", //TODO, this should be based on list type
      },
      {
        name: this.serviceRequest.srNo,
        link: null,
      },
    ];
  }

  isArchived() {
    let srDate: Date = new Date(this.serviceRequest?.submittedAt);
    let threeMonthsAgo: Date = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return srDate < threeMonthsAgo;
  }
  ///-----------MULTIPART REQUEST

  getFormData(): any {
    let formData = new FormData();
    for (let file of this.files) {
      formData.append("files[]", file);
    }

    formData.append("comment", this.comments);
    formData.append("status", this.selectedStatus);

    return formData;
  }
  onChange(target: EventTarget) {
    const textarea = target as HTMLTextAreaElement;
    const value = textarea.value;
    console.log("Textarea value:", value);
    this.comments = value;
  }

  upload() {
    let formData = this.getFormData();
    console.log(formData);
    this.appService
      .submitServiceRequest(this.serviceRequest?.id, formData)
      .subscribe({
        next: (data: any) => {
          this.modal.success({
            nzTitle: "Success",
            nzContent: "Service Request updated successfully",
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.router.navigate(["client", "service-requests", "all"]);
            },
            nzOnCancel: () => {
              this.router.navigate(["client", "service-requests", "all"]);
            },
          });
        },
        error: (err: any) => {
          console.log(err);
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Unable to save the changes: " + err?.message,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
          this.selectedStatus = this.serviceRequest.status;
        },
      });
  }
}
