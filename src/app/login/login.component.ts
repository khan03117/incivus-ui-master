import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../_services/auth.service";
import { AppServices } from "../_services/app.service";
import { StorageService } from "../_services/storage.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { CONSTANTS } from "../common/constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });
  unBlur: boolean = false;
  pwdBlur: boolean = false;
  submitted: boolean = false;
  isVisible: boolean = false;
  errorResponse: any = {};
  authReponse: any = {};
  rnBlur: boolean = false;
  ROLES = CONSTANTS.ROLES;

  constructor(
    private authService: AuthService,
    private appService: AppServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      let userObj = this.storageService.getUser();
      if (userObj) {
        this.goToNextPage(userObj);
      }
      this.loginForm = this.formBuilder.group({
        username: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
      });
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      this.modal.error({
        nzTitle: "Error",
        nzContent:
          "Hold on! Your login is missing some vital details. Please enter both your login ID and password to proceed.",
        nzMaskClosable: false,
        nzKeyboard: false,
      });
      return;
    }
    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.goToNextPage(data);
      },
      error: (err) => {
        const mailTo = "support@incivus.ai";
        const mail = `<a href="${"support@incivus.ai"}"> </a>`;
        this.modal.error({
          nzTitle: "Error",
          nzContent:
            err.error == "User Not Found"
              ? `User not found. Please contact <a href="mailTo: support#incivus.ai"> support@incivus.ai </a> for further assistance`
              : `Please check your LoginID and Password and try again. For further assistance, reach out to <a href="mailTo: support#incivus.ai"> support@incivus.ai </a>`,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log("Info OK"),
        });
      },
    });
  }
  goToNextPage(userObj: any) {
    let fa = userObj.client?.featureAccess;
    console.log("goToNextPage", userObj);

    if (userObj.roles.includes("INCIVUS_ADMIN")) {
      this.router.navigate(["client", "list"]);
    } else if (userObj.roles.includes("SERVICE_MANAGER")) {
      console.log("service manager login");
      this.router.navigate(["settings", "service-requests"]);
    } else if (userObj.roles.includes("CL_ADMIN")) {
      this.router.navigate(["client", "company"]);
    } else if (userObj.roles.includes(this.ROLES.TRIAL_USER)) {
      console.log(
        "trial user",
        fa,
        fa?.preFlight?.isAvailable ||
          fa?.imageAd?.isAvailable ||
          fa?.videoAd?.isAvailable
      );

      // user
      if (
        fa?.preFlight?.isAvailable ||
        fa?.imageAd?.isAvailable ||
        fa?.videoAd?.isAvailable
      )
        this.router.navigate(["creatives", "pre-flight", "list"]);
      else if (fa?.inFlight?.isAvailable)
        this.router.navigate(["creatives", "in-flight", "list"]);
      else if (fa?.postFlight?.isAvailable)
        this.router.navigate(["creatives", "post-flight", "list"]);
      else if (fa?.serviceRequest)
        this.router.navigate(["client", "service-requests", "all"]);
      else this.router.navigate(["compare", "creative"]);
    } else {
      // user
      if (userObj.permission.isUpload)
        this.router.navigate(["creatives", "pre-flight", "list"]);
      else if (
        userObj.permission.isInFlight &&
        userObj.client?.featureAccess?.inFlight?.isAvailable
      )
        this.router.navigate(["creatives", "in-flight", "list"]);
      else if (
        userObj.permission.isPostFlight &&
        userObj.client?.featureAccess?.postFlight?.isAvailable
      )
        this.router.navigate(["creatives", "post-flight", "list"]);
      else if (userObj.permission.serviceRequest && fa.serviceRequest)
        this.router.navigate(["client", "service-requests", "all"]);
      else this.router.navigate(["compare", "creative"]);
    }
  }
  forgotPwd(): void {
    this.router.navigate(["forgot-pwd"]);
  }

  reloadPage(): void {
    // window.location.reload();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
