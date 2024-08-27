import { Component, ViewEncapsulation } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppServices } from "src/app/_services/app.service";
import { StorageService } from "src/app/_services/storage.service";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-create-permission",
  templateUrl: "./create-permission.component.html",
  styleUrls: ["./create-permission.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePermissionComponent {
  permissionDetails: any = {
    isUpload: false,
    isAnalyze: false,
    recall: false,
    attention: false,
    cognitiveLoad: false,
    adCopy: false,
    brandCompliance: false,
    emotion: false,
    digitalAccessibility: false,
    viewFullReport: false,
    downloadFullReport: false,
    viewSummaryPage: false,
    downloadSummaryPage: false,
    viewABTestReport: false,
    downloadABTestReport: false,
    serviceRequest: false,
  };
  step: string = "one";
  addPermissionForm = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.maxLength(25),
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]{1,}$/),
    ]),
    description: new FormControl("", [Validators.maxLength(500)]),
    roles: new FormControl([]),
  });
  clientId: string = "";
  client: any;
  permissionId: string = "";
  roles: any = null;
  continueOne: boolean = false;
  blurPN: boolean = false;
  permissionRes: any;
  warningMsg: string =
    "You must create permissions before a role is created. You can assign more than 1 permission to a role.";
  breadcrumb: any = [
    {
      name: "Settings",
      link: null,
    },
    {
      name: "Permission",
      link: "/client/permission",
    },
  ];

  constructor(
    private service: AppServices,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      let user = this.storage.getUser();
      if (user && user.roles.includes("INCIVUS_ADMIN")) {
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      this.client = user.client;
      this.permissionId = this.route.snapshot.params["permissionId"]
        ? this.route.snapshot.params["permissionId"]
        : "create";
      this.getRoles();
      if (this.permissionId.toLowerCase() !== "create") {
        this.breadcrumb.push({
          name: "Edit permission",
          link: null,
        });
        this.getPermissionData();
      } else {
        this.breadcrumb.push({
          name: "Create new permission",
          link: null,
        });
        this.addPermissionForm = this.formBuilder.group({
          name: new FormControl("", [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/),
          ]),
          description: new FormControl("", [Validators.maxLength(500)]),
          roles: new FormControl([]),
        });
      }
    }, 10);
  }

  getRoles(): any {
    this.service.getCreatePermissionData(this.clientId).subscribe({
      next: (data) => {
        let response: any = data;
        this.roles = response.role;
      },
      error: (err) => {
        this.roles = [];
      },
    });
  }

  getPermissionData(): void {
    this.service.getPermissionDetails(this.permissionId).subscribe({
      next: (data) => {
        let permission: any = data;
        this.permissionRes = data;
        this.addPermissionForm = this.formBuilder.group({
          name: new FormControl({ value: permission.name, disabled: true }, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/),
          ]),
          description: new FormControl(permission.description, [
            Validators.maxLength(500),
          ]),
          roles: new FormControl(permission.roleList),
        });
        this.permissionDetails = permission.permissionDetails;
        this.permissionDetails.downloadABTestReport = false;
        this.permissionDetails.downloadFullReport = false;
      },
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addPermissionForm.controls;
  }

  cancel = () => {
    this.router.navigate(["client", "permission"]);
  };

  cancelTwo = () => {
    this.step = "one";
  };

  save = () => {
    let permissionData: any = this.addPermissionForm.value;
    permissionData["permissionDetails"] = this.permissionDetails;
    permissionData["clientId"] = this.clientId;

    this.service.createPermission(permissionData).subscribe({
      next: (data) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "Permission created successfully",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "permission"]);
          },
        });
      },
      error: (err: any) => {
        if (err && err.error && err.error.errorCode === "NAME_EXIST") {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Permission name already exist",
            nzClosable: false,
            nzOnOk: () => {
              this.step = "one";
            },
          });
        } else {
          this.modal.error({
            nzTitle: "Error",
            nzContent:
              "We are facing some technical issue pleae try again later",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {},
          });
        }
      },
    });
  };

  update = () => {
    let permissionData: any = this.addPermissionForm.value;
    permissionData["permissionDetails"] = this.permissionDetails;
    permissionData["clientId"] = this.clientId;
    permissionData["id"] = this.permissionId;

    let prevRoleList = this.permissionRes.roleList;
    let newRoleList = permissionData.roles;
    let removedRoles: string[] = [];
    prevRoleList.forEach((role: string) => {
      if (newRoleList.indexOf(role) === -1) {
        removedRoles.push(role);
      }
    });
    permissionData["removedRoles"] = removedRoles;
    this.service.updatePermission(permissionData).subscribe({
      next: (data) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "Permission updated successfully",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "permission"]);
          },
        });
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: err.error.error + "::" + err.error.message,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log("Info OK"),
        });
      },
    });
  };

  continue = () => {
    this.continueOne = true;
    if (this.addPermissionForm.status.toLowerCase() === "invalid") {
      return;
    }
    this.continueOne = false;
    this.step = "two";
  };
}
