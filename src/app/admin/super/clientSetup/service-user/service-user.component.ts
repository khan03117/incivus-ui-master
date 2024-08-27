import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AppServices } from "src/app/_services/app.service";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { EventData } from "src/app/_shared/event.class";

@Component({
  selector: "app-service-user",
  templateUrl: "./service-user.component.html",
  styleUrls: ["./service-user.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceUserComponent implements OnInit {
  constructor(
    private eventBusService: EventBusService,
    private appService: AppServices
  ) {}
  ngOnInit(): void {
    this.userForm.patchValue(this.serviceUser);
  }
  handleClose() {
    this.closePopup.emit(this.serviceUser);
  }
  onCancelClicked() {
    this.cancel.emit();
  }
  // This component shows the modal window to add / edit Service Request User in CreateClientComponent

  errorMsg: String;
  userForm = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    status: new FormControl("", [Validators.required]),
    clientId: new FormControl("", [Validators.required]),
  });
  blurFN: boolean = false;
  blurLN: boolean = false;
  blurEmail: boolean = false;
  @Input() serviceUser: any;
  @Output() closePopup = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  saveUser() {
    if (this.userForm.status.toLowerCase() === "invalid") {
      this.errorMsg =
        "Oops! You might have left one or more mandatory fields empty.";
      return;
    } else this.errorMsg = "";
    var data = { ...this.userForm.value };
    // data.clientId =
    this.appService.postServiceManager(data).subscribe(
      (response) => {
        console.log("service-user save response", response);
        this.onSaveSuccess(response, "service_user_save");
      },
      (error) => {
        this.errorMsg = error?.error?.message ?? error?.message;
        console.log("error", error);
      }
    );
    // this.errorMsg = " Something went wrong";
  }
  updateUser() {
    if (this.userForm.status.toLowerCase() === "invalid") {
      this.errorMsg =
        "Oops! You might have left one or more mandatory fields empty.";
      return;
    } else this.errorMsg = "";
    var data: any = { id: this.serviceUser.id, ...this.userForm.value };
    // data.clientId =
    this.appService.putServiceManager(this.serviceUser?.id, data).subscribe(
      (response) => {
        console.log("service-user update response", response);
        this.onSaveSuccess(response, "service_user_update");
      },
      (error) => {
        this.errorMsg = error?.error?.message ?? error?.message;
      }
    );
    // this.errorMsg = " Something went wrong";
  }

  onSaveSuccess(response: any, type: string) {
    this.save.emit(response);

    this.eventBusService.emit(new EventData(type, response));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
}
