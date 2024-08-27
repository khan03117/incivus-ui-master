import { Component, Input } from "@angular/core";
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
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-user-create-modal",
  templateUrl: "./userCreate.component.html",
  styleUrls: ["./userCreate.component.less"],
})
export class UserCreateComponent {
  @Input() public data: any;
  @Input() public type: any;

  userForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    emailId: new FormControl(""),
    status: new FormControl(""),
  });
  blurFN: boolean = false;
  blurLN: boolean = false;
  blurEmail: boolean = false;
  trialCompany: boolean = false;
  errorMsg: string = "";
  user: any;
  isClientAdmin: boolean = false;
  isBothAdmin: boolean = false;
  isServiceRequest: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService,
    private appService: AppServices,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.trialCompany =
        this.data &&
        this.data.client &&
        this.data.client.status &&
        this.data.client.status.toLowerCase() === "trial"
          ? true
          : false;
      this.isServiceRequest =
        this.data?.client?.featureAccess?.serviceRequest ?? false;
      if (this.data && this.data.user && this.data.user.length == 1) {
        this.user = this.data.user[0];
        this.userForm = this.formBuilder.group({
          firstName: [
            this.user.firstName,
            [Validators.required, Validators.minLength(3)],
          ],
          lastName: [
            this.user.lastName,
            [Validators.required, Validators.minLength(1)],
          ],
          emailId: [
            { value: this.user.email, disabled: true },
            [Validators.required, Validators.email],
          ],
          status: [this.user.status, Validators.required],
        });
      } else {
        this.userForm = this.formBuilder.group({
          firstName: ["", [Validators.required, Validators.minLength(3)]],
          lastName: ["", [Validators.required, Validators.minLength(1)]],
          emailId: ["", [Validators.required, Validators.email]],
          status: ["inactive", Validators.required],
        });
      }
      this.isClientAdmin = this.data.client.isClientAdmin;
      this.isBothAdmin = this.data.client.isBothAdmin;
    }, 10);

    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        if (action.name === "toggle_service_request") {
          // Based on "Service Request" feature turned on or off
          this.isServiceRequest = action?.value?.toggle;
        }
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  cancel(): void {
    if (this.user) {
      this.appService.deleteUser(this.user.id).subscribe({
        next: (data) => {
          this.modal.info({
            nzTitle: "Success",
            nzContent: "User deleted successfully",
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.user = null;
              this.resetForm();
            },
          });
        },
        error: (err) => {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Unable to delete user, please try again later",
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => console.log("Info OK"),
          });
        },
      });
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(1)]],
      emailId: ["", [Validators.required, Validators.email]],
      status: ["inactive", Validators.required],
    });
  }

  saveUser(): void {
    this.eventBusService.emit(new EventData("company_form_error", ""));
    console.log(
      `userCreateComponent saveUser() isClientAdmin:${
        this.isClientAdmin
      } trialCompany:${
        this.trialCompany
      } (this.isClientAdmin && !this.trialCompany) = ${
        this.isClientAdmin && !this.trialCompany
      }`
    );

    if (
      this.isClientAdmin == true &&
      (this.data.client.featureAccess.inFlight.isAvailable ||
        this.data.client.featureAccess.postFlight.isAvailable)
    ) {
      const error =
        "Please note, this Client has access to in-flight and post-flight features that would require channel setup. Please add Client side admin and allow access to Incivus admin.";
      this.eventBusService.emit(new EventData("company_form_error", error));
      return;
    }
    // I'll Administer = true  & Not in trial mode
    if (this.isClientAdmin && !this.trialCompany) {
      if (this.user && this.user.id) {
        // update user
        let userData: any = this.userForm.getRawValue();
        userData["status"] = "inactive";
        userData["id"] = this.user.id;
        userData["clientId"] = this.data.client.id;
        this.appService.editUser(userData);
      }
      // update client
      if (this.data.client) {
        let clientData: any = {};
        clientData.id = this.data.client.id;
        clientData.featureAccess = this.data.client.featureAccess;
        clientData.name = this.data.client.companyName;
        clientData.status = this.data.client.status;
        clientData.oversight = this.data.client.oversight;
        clientData.isClientAdmin = this.isClientAdmin;
        clientData.noOfUser = this.data.client.noOfUser;

        console.log("editClient", this.data);

        this.appService.editClient(clientData).subscribe({
          next: (data) => {
            // this.data.client.isClientAdmin = this.isClientAdmin;
            if (this.isServiceRequest) {
              this.eventBusService.emit(
                new EventData("on_admin_setup_complete", true)
              );
            } else
              this.modal.success({
                nzTitle: "Success",
                nzContent: "Customer setup successfully completed",
                nzMaskClosable: false,
                nzKeyboard: false,
                nzOnOk: () => {
                  this.router.navigate(["client", "list"]);
                },
              });
          },
          error: (err) => {
            this.modal.error({
              nzTitle: "Error",
              nzContent:
                "We are facing some technical issue pleae try again later",
              nzMaskClosable: false,
              nzKeyboard: false,
              nzOnOk: () => {},
            });
          },
        });
      }
    } else {
      if (this.userForm.status.toLowerCase() === "invalid") {
        const error =
          "Oops! You might have left one or more mandatory fields empty. Please cross check once and add the necessary information.";
        this.eventBusService.emit(new EventData("company_form_error", error));
        return;
      }

      if (this.user && this.user.id) {
        // update admin user
        let userData: any = this.userForm.getRawValue();
        if (this.trialCompany) {
          userData["role"] = "TRIAL_USER";
        } else {
          userData["role"] = "CL_ADMIN";
        }
        userData["id"] = this.user.id;
        userData["clientId"] = this.data.client.id;
        userData["isBothAdmin"] = this.isBothAdmin;
        // update user
        this.appService.editUser(userData).subscribe({
          next: (data) => {
            console.log(
              "userCreateComponent saveUser() appService.editUser",
              userData,
              this.data
            );

            this.data.client.isBothAdmin = this.isBothAdmin;

            if (this.isServiceRequest) {
              this.eventBusService.emit(
                new EventData("on_admin_setup_complete", true)
              );
            } else
              this.modal.info({
                nzTitle: "Success",
                nzContent: "User updated successfully",
                nzMaskClosable: false,
                nzKeyboard: false,
                nzOnOk: () => {
                  if (this.trialCompany) {
                    this.eventBusService.emit(
                      new EventData("trial_user_saved", "")
                    );
                  } else {
                    this.user = data;
                  }
                },
              });
          },
          error: (err) => {
            if (this.type && this.type == "modal") {
              if (err.error && err.error.message) {
                this.errorMsg = err.error.message;
              } else {
                this.errorMsg =
                  "We are facing some glitches, please try again later.";
              }
            } else {
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
            }
          },
        });
      } else {
        let userData: any = this.userForm.value;
        if (this.trialCompany) {
          userData["role"] = "TRIAL_USER";
        } else {
          userData["role"] = "CL_ADMIN";
          userData["isBothAdmin"] = this.isBothAdmin;
        }
        userData["clientId"] = this.data.client.id;
        this.appService.saveUser(userData).subscribe({
          next: (data) => {
            // this.data.client.isBothAdmin = this.isBothAdmin;

            if (this.isServiceRequest) {
              this.eventBusService.emit(
                new EventData("on_admin_setup_complete", true)
              );
            } else
              this.modal.info({
                nzTitle: "Success",
                nzContent: "User created successfully",
                nzMaskClosable: false,
                nzKeyboard: false,
                nzOnOk: () => {
                  if (this.trialCompany) {
                    this.eventBusService.emit(
                      new EventData("trial_user_saved", "")
                    );
                  } else {
                    this.user = data;
                  }
                },
              });
          },
          error: (err) => {
            if (this.type && this.type == "modal") {
              if (err.error && err.error.message) {
                this.errorMsg = err.error.message;
              } else {
                this.errorMsg =
                  "We are facing some glitches, please try again later.";
              }
            } else {
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
            }
          },
        });
      }
    }
  }

  buttonCallback = () => {
    console.log("isCompSetupCollapse");
  };
}
