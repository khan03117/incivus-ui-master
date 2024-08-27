import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { AppServices } from "src/app/_services/app.service";
import { StorageService } from "src/app/_services/storage.service";
import {
  wordCountValidator,
  atLeastOneEntryValidator,
  futureDateValidator,
  isImage,
  isVideo,
  isOtherType,
} from "../service-requests.validators";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { FileService } from "src/app/_services/file.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-add-service-request",
  templateUrl: "./add-service-request.component.html",
  styleUrls: ["./add-service-request.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class AddServiceRequestComponent implements OnInit {
  breadcrumb: any = [
    {
      name: "Service Requests",
      link: "/client/service-requests/all",
    },
    {
      name: "New Request",
      link: null,
    },
  ];
  id: any = null;
  roles: any = null;
  documents: File[] = [];
  serviceRequest: any;
  brandAssetDocuments: File[] = [];
  blurPN: boolean = false;
  page: number = 1;
  user: any;
  formOptions: any;
  adBriefWordLimit: number = 100000; // 100k words
  brandAssetOptions: any = {};
  @ViewChild("adBriefFileInput") adBriefFileInput: ElementRef;
  @ViewChild("brandAssetFileInput") brandAssetFileInput: ElementRef;

  form: FormGroup = new FormGroup({
    summary: new FormControl("", Validators.required),
    requestType: new FormControl("", Validators.required),
    brand: new FormControl("", Validators.required),
    creativeType: new FormControl([], Validators.required),
    adBrief: new FormControl("", [wordCountValidator(this.adBriefWordLimit)]),
    channels: new FormControl([], [atLeastOneEntryValidator()]),
    serviceTeam: new FormControl("", Validators.required),
    launchDate: new FormControl("", futureDateValidator()),
    brandAssets: new FormControl([]),
    colors: new FormControl([], [atLeastOneEntryValidator()]),
    additionalDetails: new FormControl(""),
    emotions: new FormControl([], [atLeastOneEntryValidator()]),
  });
  today = new Date();

  constructor(
    private appService: AppServices,
    private storage: StorageService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private router: Router
  ) {}

  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  onFileChange(event: any) {
    console.log("onFileChange:", event.target.value);

    const prevLength = this.documents.length;
    if (event.target.files.length + prevLength > 5) {
      this.modal.error({
        nzTitle: "Error",
        nzContent:
          "Uh! oh! You cannot upload more than 5 documents in a single ticket",
        nzMaskClosable: false,
        nzKeyboard: false,
      });
      return;
    }
    var fileSizeSum = 0;
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const fileSizeInBytes = selectedFiles[i].size;
      const fileSizeInGB = fileSizeInBytes / (1024 * 1024 * 1024);
      fileSizeSum = fileSizeSum + fileSizeInGB;
    }
    if (fileSizeSum > 1) {
      this.modal.error({
        nzTitle: "Error",
        nzContent:
          "Uh! oh! The file size is too large for attaching in this ticket. Please restrict to 1GB in total.",
        nzMaskClosable: false,
        nzKeyboard: false,
      });
      return;
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        extension &&
        this.formOptions?.documentExtensions?.indexOf(extension) === -1
      ) {
        this.modal.error({
          nzTitle: "Error",
          nzContent:
            "Uh! oh! The support file types are: " +
            this.formOptions?.documentExtensions?.join(", "),
          nzMaskClosable: false,
          nzKeyboard: false,
        });
        return;
      }
      this.documents.push(selectedFiles[i]);
      console.log(selectedFiles[i]);
    }
    console.log("Number of files selected = ", this.documents.length);
    this.resetFileInput(this.adBriefFileInput);
  }

  resetFileInput(file: ElementRef): void {
    // Reset the input value to allow the same file to be selected again
    file.nativeElement.value = "";
  }
  onBrandAssetFileChange(event: any) {
    const prevLength = this.brandAssetDocuments.length;
    if (event.target.files.length + prevLength > 5) {
      this.modal.error({
        nzTitle: "Error",
        nzContent:
          "Uh! oh! You cannot upload more than 5 documents in a single ticket",
        nzMaskClosable: false,
        nzKeyboard: false,
      });
      return;
    }
    const selectedFiles = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        extension &&
        this.formOptions?.brandAssetExtensions?.indexOf(extension) === -1
      ) {
        this.modal.error({
          nzTitle: "Error",
          nzContent:
            "Uh! oh! The support file are: " +
            this.formOptions?.brandAssetExtensions?.join(", "),
          nzMaskClosable: false,
          nzKeyboard: false,
        });
        return;
      }
      this.brandAssetDocuments.push(selectedFiles[i]);
      console.log(selectedFiles[i]);
    }
    this.resetFileInput(this.brandAssetFileInput);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getVideoUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  getThumbnailUrl(file: File): string {
    return isVideo(file) ? this.getImageUrl(file) : "";
  }
  getFileName(url: string) {
    console.log("getFileName:", url);

    return this.fileService.getFileNameFromUrl(url);
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
  removeFile(i: number) {
    this.documents.splice(i, 1);
    this.cdr.detectChanges();
  }
  removeExistingFile(i: number) {
    this.serviceRequest?.documents.splice(i, 1);
    this.cdr.detectChanges();
  }
  removeBrandAssetFile(i: number) {
    this.brandAssetDocuments.splice(i, 1);
    this.cdr.detectChanges();
  }
  removeExistingBrandAssetFile(i: number) {
    this.serviceRequest?.brandAssetDocuments.splice(i, 1);
    this.cdr.detectChanges();
  }

  OnContinueClicked() {
    if (this.page == 1) {
      // Validate Page 1
      this.form.get("summary")?.markAsTouched();
      this.form.get("requestType")?.markAsTouched();
      this.form.get("creativeType")?.markAsTouched();
      this.form.get("brand")?.markAsTouched();
      this.form.get("adBrief")?.markAsTouched();
      this.form.get("channels")?.markAsTouched();
      if (
        this.form.get("summary")?.valid &&
        this.form.get("requestType")?.valid &&
        this.form.get("creativeType")?.valid &&
        this.form.get("brand")?.valid &&
        this.form.get("adBrief")?.valid &&
        this.form.get("channels")?.valid
      )
        this.page++;
    } else {
      // api call
    }
  }
  goBack = () => {
    if (this.page > 1) {
      this.page--;
    } else {
      // api call
    }
  };

  emotionOptions: any = [
    { label: "Neutral", value: "neutral", checked: false, disabled: false },
    { label: "Happy", value: "happy", checked: false, disabled: false },
    { label: "Sad", value: "sad", checked: false, disabled: false },
    { label: "Surprised", value: "surprised", checked: false, disabled: false },
    { label: "Scared", value: "scared", checked: false, disabled: false },
    { label: "Disgust", value: "disgust", checked: false, disabled: false },
    { label: "Angry", value: "angry", checked: false, disabled: false },
  ];

  submitForm = () => {
    this.markAllFieldsAsTouched(this.form);
    if (this.form.valid) {
      this.uploadData("Open"); // status
    }
  };
  saveProgress = () => {
    this.uploadData("Draft");
  };
  uploadData(status: string) {
    const formData = new FormData(); // Create a new FormData instance
    formData.append("status", status);
    // Append form fields to the FormData instance
    Object.keys(this.form.value).forEach((key) => {
      formData.append(key, this.form.value[key]);
    }); // Append the files
    if (this.id != null && this.serviceRequest != null) {
      formData.append("existingDocuments", this.serviceRequest.documents ?? []);
      formData.append(
        "existingBrandAssetDocuments",
        this.serviceRequest.brandAssetDocuments ?? []
      );
    }
    this.documents.forEach((file) => {
      formData.append("documents[]", file);
    });
    this.brandAssetDocuments.forEach((file) => {
      formData.append("brandAssetDocuments[]", file);
    });
    if (formData.get("launchDate") == null) formData.set("launchDate", "");
    if (this.id == null) {
      this.appService.postServiceRequest(formData).subscribe(
        (response: any) => {
          console.log("Form submitted successfully:", status, response);
          if (status != "Draft") {
            this.modal.success({
              nzTitle: "Success",
              nzContent: "Service Request created successfully",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {
                this.router.navigate(["client", "service-requests", "all"]);
              },
            });
          } else {
            this.modal.success({
              nzTitle: "Success",
              nzContent: "Information saved succesfully.",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {
                if (this.id == null)
                  this.router.navigate([
                    "client",
                    "service-requests",
                    response.id,
                    "edit",
                  ]);
              },
              nzOnCancel: () => {
                if (this.id == null)
                  this.router.navigate([
                    "client",
                    "service-requests",
                    response.id,
                    "edit",
                  ]);
              },
            });
          }
        },
        (error) => {
          console.error("Error submitting form:", error);
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Service Request creation Failed: " + error.message,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
        }
      );
    } else {
      this.appService.putServiceRequest(this.id, formData).subscribe(
        (response) => {
          console.log("Form submitted successfully:", response);
          if (status != "Draft")
            this.modal.success({
              nzTitle: "Success",
              nzContent: "Service Request created successfully",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {
                this.router.navigate(["client", "service-requests", "all"]);
              },
            });
          else {
            this.modal.success({
              nzTitle: "Success",
              nzContent: "Information saved succesfully.",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {},
            });
          } 
        },
        (error) => {
          console.error("Error submitting form:", error);
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Service Request creation Failed: " + error.message,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
        }
      );
    }
  }
  markAllFieldsAsTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFieldsAsTouched(control);
      }
    });
  }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.fetchFormOptions();
    this.form.get("brand")?.valueChanges.subscribe((value) => {
      console.log("brand change:", value);
      this.updateBrandAssetDropDown(value);
    });
    this.checkForDraftForm();
  }
  checkForDraftForm() {
    // this.router.navigate(["client", "service-requests", id, "edit"]);
    // Subscribe to the route query parameters
    this.route.params.subscribe((params) => {
      // Check if data parameter exists and parse it back to an object
      if (params["id"]) {
        this.id = params["id"];
        this.fetchServiceRequest();
      }
    });
  }

  fetchServiceRequest(): void {
    this.appService.getServiceRequest(this.id).subscribe((response: any) => {
      if (
        this.user.id == response?.submittedBy?.id &&
        response?.status?.toLowerCase() == "draft"
      ) {
        if (response.launchDate == null) response.launchDate = "";
        this.serviceRequest = response;
        this.form.patchValue(response);
        this.colorCodeList = response?.colors;
        this.breadcrumb = [
          {
            name: "Service Requests",
            link: "/client/service-requests/all",
          },
          {
            name: response?.srNo,
            link: null,
          },
        ];
      } else {
        this.router.navigate(["client", "service-requests", this.id, "view"]);
      }
    });
  }
  updateBrandAssetDropDown(brand: string) {
    const options: any = {};
    if (brand != null && brand != "") {
      {
        const brandGuideline = this.formOptions.brandGuidelines.find(
          (item: any) => item.name == brand
        );
        console.log(`${brand} -> brandAsset:`, brandGuideline);
        if (brandGuideline != null) {
          if (brandGuideline.logo != null) options.logo = brandGuideline.logo;
          if (brandGuideline.audio != null)
            options.audio = brandGuideline.audio;
        }
      }
      this.brandAssetOptions = options;
    }
  }
  fetchFormOptions() {
    this.appService
      .getServiceRequestFormOptions()
      .subscribe((response: any) => {
        this.formOptions = response;
      });
  }

  hexPattern = /^[0-9a-fA-F]+$/;
  addColorCodeList(): void {
    console.log("color error:", this.form.controls["colors"].errors);

    if (this.colorcode.trim() !== "" && this.hexPattern.test(this.colorcode)) {
      if (this.colorcode.indexOf("#") === -1 && this.colorcode.length === 6) {
        this.colorCodeList.push("#" + this.colorcode.toUpperCase());
        this.colorcode = "";
      } else if (this.colorcode.length === 7) {
        this.colorCodeList.push(this.colorcode.toUpperCase());
        this.colorcode = "";
      }
      this.form.controls["colors"].setValue(this.colorCodeList);
    }
  }
  testHex() {
    if (this.colorcode == null || this.colorcode == "") return true;
    return this.hexPattern.test(this.colorcode);
  }
  remove_color(index: any) {
    this.colorCodeList.splice(index, 1);
    this.form.controls["colors"].setValue(this.colorCodeList);
  }
  colorcode: string = "";
  colorCodeList: any = [];
}
