import {
  Component,
  ViewContainerRef,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { AppServices } from "src/app/_services/app.service";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";
import { StorageService } from "src/app/_services/storage.service";
import { EventBusService } from "src/app/_shared/event-bus.service";
import { Subject, Subscription, takeUntil } from "rxjs";

@Component({
  selector: "app-add-media-account",
  templateUrl: "./add-media-account.component.html",
  styleUrls: ["./add-media-account.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class AddMediaAccountComponent implements OnInit, OnDestroy {
  step: number = 1; // 1: Mapping,2: Token, 3: Ad Account List, 4: Page List
  isLoading: boolean = false;
  brandDetails: any = [];
  @Input() editAccount: any | null;
  form = new FormGroup({
    accessToken: new FormControl("", [Validators.required]),
    business: new FormControl("", [Validators.required]),
    accountList: this.fb.array([], [Validators.minLength(1)]), // Initialize the form array for accountList
  });
  @Output() onAddSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onStepChange: EventEmitter<number> = new EventEmitter<number>();

  warningMsg: string = "";
  alert: any = {};

  businessList: any[] = [];
  accountList: any[] = [];
  pageList: any[] = [];
  showToken: boolean = false;
  loginWithFacebook: boolean = true;

  markets: string[] = [];

  loggedIn: boolean;
  clientId: any;
  connectionMessage: string = "";
  checked: boolean;
  globalCheckStatus: number = 2; // 0: None, 1: Some, 2: All;
  indeterminate: boolean;
  setOfCheckedId = new Set<String>();
  modalRef: NzModalRef;
  private authServiceSubscription: Subscription;
  private user: SocialUser;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private service: AppServices,
    private storage: StorageService,
    private eventBusService: EventBusService,
    private socialAuthService: SocialAuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authServiceSubscription = this.socialAuthService.authState.subscribe(
      (user) => {
        this.user = user;
        if (user != null) {
          this.form.patchValue({ accessToken: user.authToken });
          this.connectionMessage = "Account Connected Successfully";
          console.log("auth token = ", this.form.controls.accessToken.value);
          this.loggedIn = user != null;
          this.continue();
        }
      }
    );

    setTimeout(() => {
      let user = this.storage.getUser();

      this.clientId = user.client.id;
      this.brandDetails = user?.client?.brandDetails;
      // Extract subEntity where masterEntity is 'Geography'
      let geographySubEntities: string[] | null = null;
      for (const entityMapItem of user?.client?.entityMap) {
        if (
          entityMapItem.masterEntity === "Geography" ||
          entityMapItem.masterEntity === "Market"
        ) {
          geographySubEntities = entityMapItem.subEntity;
          break;
        }
      }
      this.markets = geographySubEntities ?? [];
    }, 10);

    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        this.isLoading = action.value === "start";
      });
    console.log(
      "ngOnInit AddMediaComponent",
      this.editAccount,
      this.accountList,
      this.step
    );

    if (this.editAccount != null) {
      this.step = 3;
      this.accountList = [this.editAccount];
      this.setAccountListInForm();
    }
  }
  ngOnDestroy() {
    // this.form.reset();
    this.step = 1;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.user) {
      this.socialAuthService.signOut().catch((err) => {
        console.error("Error during sign out:", err);
      });
    }
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }
  onCurrentPageDataChange($event: readonly any[]) {
    console.log("onCurrentPageDataChange", $event);
  }

  toggleTokenVisibility() {
    this.showToken = !this.showToken;
    console.log("toggleTokenVisibility", this.showToken);
    if (!this.showToken) {
      this.form.patchValue({ accessToken: "" });
      this.signInWithFB();
    }
    return true;
  }

  onItemChecked(account: any, value: boolean): void {
    console.log("onItemChecked", account, value);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    let accounts = this.items.controls;
    accounts.forEach((item) => item.patchValue({ checked: value }));
    console.log("onAllChecked", value, accounts);
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    let accounts = this.items.controls;
    let selected = accounts.filter((item) => {
      return item.value.checked == true;
    });
    this.globalCheckStatus =
      selected.length == accounts.length
        ? 2
        : this.setOfCheckedId.values.length > 0
        ? 1
        : 0;
    this.indeterminate = this.globalCheckStatus == 1;
  }
  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  save() {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get f2(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  getAdAccountList() {
    this.service
      .getAdAccountList(
        this.form.controls.accessToken.value?.toString() ?? "",
        this.form.controls.business.value?.toString() ?? ""
      )
      .subscribe(
        (response: any) => {
          this.accountList = response.data;
          this.setAccountListInForm();
          this.step++;
          this.onStepChange.emit(this.step);
        },
        (error) => {
          console.error("Request failed:", error);
          this.connectionMessage =
            error?.error?.error?.message ?? "Connection failed";
        }
      );
  }

  // Method to set accountList to the form
  setAccountListInForm() {
    const array = this.form.get("accountList") as FormArray;
    array.clear(); // Clear any existing form controls in the array
    this.accountList.forEach((item) => {
      array.push(this.createItemFormGroup(item));
    });
    console.log("setAccountListInForm", this.accountList, array);
  }

  createItemFormGroup(item: any): FormGroup {
    const group: FormGroup = this.fb.group({
      checked: [true],
      id: [item.id],
      account_id: [item.account_id],
      name: [item.name],
      brand: [item.brand ?? "", Validators.required],
      markets: [item.markets ?? []],
    });

    // Subscribe to changes in 'checked' to enable/disable 'markets'
    group.get("checked")?.valueChanges.subscribe((checked) => {
      const brandControl = group.get("brand");
      const marketsControl = group.get("markets");
      if (checked) {
        brandControl?.enable();
        marketsControl?.enable();
      } else {
        brandControl?.disable();
        marketsControl?.disable();
      }
    });

    // // Disable markets control initially
    // group.get("brand")?.disable();
    // group.get("markets")?.disable();
    return group;
  }
  get items(): FormArray {
    return this.form.get("accountList") as FormArray;
  }
  getBusinesses() {
    this.service
      .getBusinesses(this.form.controls.accessToken.value?.toString() ?? "")
      .subscribe(
        (response: any) => {
          this.businessList = response.data;
          this.step++;
        },
        (error) => {
          console.error("Request failed:", error);
          this.connectionMessage =
            error?.error?.error?.message ?? "Connection failed";
        }
      );
  }
  getPageList() {
    this.service
      .getPageList(this.form.controls.accessToken.value?.toString() ?? "")
      .subscribe(
        (response: any) => {
          this.pageList = response.data;

          this.step++;
        },
        (error) => {
          console.error("Request failed:", error);
        }
      );
  }
  onCheckboxChange(item: any) {
    // if (item.checked == null || item.checked == undefined) item.checked = false;
    item.checked = !item.checked;
    // Call your other functions or perform actions here
  }

  continue() {
    this.alert = {};
    if (this.step == 1) {
      this.getBusinesses();
    } else if (this.step == 2) {
      this.getAdAccountList();
    } else if (this.step == 3) {
      this.uploadData();
    } else {
      this.step++;
    }
    this.onStepChange.emit(this.step);
  }
  back(): void {
    console.log("back:", this.form.controls.business.value);

    if (this.step > 0) {
      this.step--;
    }
    if (this.step < 3) this.onStepChange.emit(this.step);
    this.cdr.detectChanges();
  }
  uploadData() {
    let data: any = {};
    data.token = this.form?.get("accessToken")?.value;
    const selectedAccounts: any[] | undefined =
      this.form.value.accountList?.filter((item: any) => item.checked);
    if (selectedAccounts == null || selectedAccounts.length == 0) {
      this.alert = {
        msg: "Please select at least 1 Ad Account to continue.",
        type: "error",
      };
      return;
    }
    if (selectedAccounts != undefined) {
      for (let i = 0; i < selectedAccounts.length; i++) {
        if (
          selectedAccounts[i].brand == null ||
          selectedAccounts[i].brand?.trim() == ""
        ) {
          this.alert = {
            msg: "Please select a brand for " + selectedAccounts[i]?.name,
            type: "error",
          };
          return;
        }
        if (
          selectedAccounts[i].markets == null ||
          selectedAccounts[i].markets.length == 0
        ) {
          this.alert = {
            msg: "Please select a market for " + selectedAccounts[i]?.name,
            type: "error",
          };
          return;
        }
      }
    }

    data.adAccounts = selectedAccounts;
    data.clientId = this.clientId;
    data.type = "Facebook";
    // console.log("uploadData data:", data, brand, markets);
    if (this.editAccount != null && selectedAccounts.length == 1) {
      this.service
        .updateMediaAccount(
          this.editAccount.mediaAccountId,
          selectedAccounts[0]
        )
        .subscribe((response) => {
          console.log("postMediaAccount", response);
          this.onAddSuccess.emit(response);
        });
    } else {
      this.service.postMediaAccount(data).subscribe((response) => {
        console.log("postMediaAccount", response);
        this.onAddSuccess.emit(response);
      });
    }
  }
  enableContinue() {
    // return true;
    if (this.step == 1) {
      // Login with facebook
      return this.form.controls.accessToken.valid;
    } else if (this.step == 2) {
      // Select businesse
      return this.form.controls.business.valid;
    } else if (this.step == 3) {
      // Map Account with Brand and Market
      return (
        this.form.controls.accountList.valid &&
        this.form.controls.accountList.value != null &&
        this.form.controls.accountList.value.length > 0
      );
    }
    return this.form.controls.accessToken.value != "";
  }
  handleSelectionChange(selectedValues: string[]) {
    console.log("Selected Items:", selectedValues);
  }
}
