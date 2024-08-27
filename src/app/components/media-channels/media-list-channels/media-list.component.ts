import {
  Component,
  ViewContainerRef,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { AddMediaAccountComponent } from "../add-media-account/add-media-account.component";
import { AppServices } from "src/app/_services/app.service";
import { StorageService } from "src/app/_services/storage.service";

@Component({
  selector: "app-media-channels",
  templateUrl: "./media-list.component.html",
  styleUrls: ["./media-list.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class MediaAccountListComponent implements OnInit {
  isIncAdmin: boolean = false;
  isLoading: boolean = false;
  checked = false;
  showMenu = false;
  indeterminate = false;
  user: any;
  infoMsg: string = "";
  errorMsg: string = "";
  breadcrumb: any = [
    {
      name: "Media accounts",
      link: "/client/list",
    },
    {
      name: "Connected accounts",
      link: null,
    },
  ];

  mediaAccountList: any[] = [];
  adAccountList: any[] = [];
  filteredList: any[] = [];
  searchText = "";
  showAddMediaModal: boolean = false;
  addMediaAccountStep: number = 0;
  editAccount: any | null = null; // value will be set only during "edit" phase
  constructor(
    private router: Router,
    private service: AppServices,
    private storage: StorageService,
    private modal: NzModalService,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.user = this.storage.getUser();
      this.fetchAdAccounts();
    }, 10);
  }

  fetchAdAccounts() {
    this.service.getMediaAccounts().subscribe(
      (response: any) => {
        console.log("fetchAdAccounts", response);
        this.mediaAccountList = response;
        this.buildAdAccountList();
      },
      (error) => {
        // TODO - error handling
        console.log("fetchAdAccounts error:", error);
      }
    );
  }

  addAccount() {
    this.showAddMediaModal = true;
    this.addMediaAccountStep = 1;
  }
  onAddSuccess(response: any) {
    console.log("in add account", response);
    this.mediaAccountList = response;
    this.buildAdAccountList();
    this.showAddMediaModal = false;
    this.editAccount = null;
  }
  onAddStepChange(step: number) {
    this.addMediaAccountStep = step;
    console.log("onAddStepChange:", step);
    this.cdr.detectChanges();
  }
  onModalClose() {
    console.log("onModalClose");
    this.showAddMediaModal = false;
    this.editAccount = null;
  }

  save() {}

  onDeleteAdAccountClicked(account: any) {
    console.log("confirm delete", account);

    this.modal.confirm({
      nzTitle: "Confirm delete",
      nzContent:
        account.artifactCount > 0
          ? "Please note, Ads attached to this account has been analyzed and reports are available for the same. If you delete this account, the Ad Reports will also be deleted from your account. Are you sure you want to delete the media account?"
          : "Do you really want to delete the Media Account?",
      nzOkText: "Yes",
      nzClassName: "short-modal",
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => {
        this.service
          .deletAdAccount(account.mediaAccountId, account.id)
          .subscribe({
            next: (response: any) => {
              let found = false;
              for (let mediaAccount of this.mediaAccountList) {
                for (let i = 0; i < mediaAccount.adAccounts.length; i++) {
                  if (mediaAccount.adAccounts[i]?.id == account?.id) {
                    console.log(
                      "delete found",
                      mediaAccount.adAccounts[i],
                      account.id
                    );
                    mediaAccount.adAccounts.splice(i, 1);
                    found = true;
                    break;
                  }
                  if (found) break;
                }
              }
              this.buildAdAccountList();
            },
          });
      },
      nzCancelText: "No",
      nzOnCancel: () => true,
    });
  }

  onEditAdAccountClicked(account: any) {
    this.editAccount = account;
    this.showAddMediaModal = true;
    this.addMediaAccountStep = 3;
    console.log(
      "onEditAdAccountClicked",
      this.editAccount,
      this.addMediaAccountStep
    );
  }

  filter() {
    const newList: any[] = [];
    this.adAccountList.forEach((value: any) => {
      if (
        this.includesSearchText(value?.type) ||
        this.includesSearchText(value?.account_id) ||
        this.includesSearchText(value?.name) ||
        this.includesSearchText(value?.brands?.join(", ")) ||
        this.includesSearchText(value?.markets?.join(", "))
      ) {
        newList.push(value);
      }
    });

    this.filteredList = newList;
  }

  includesSearchText = (str: string) =>
    str?.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase());

  editMultiple() {
    let selectedAccountsList = this.filteredList.filter(
      (item) => item.checked == true
    );
  }

  deleteMultiple() {}

  onAllChecked(value: boolean): void {
    this.filteredList.forEach((item) => (item.checked = value));
    this.showMenu = value;
    this.indeterminate = false;
    console.log(
      "onAllChecked",
      this.showMenu,
      this.checked,
      this.indeterminate
    );

    // this.refreshCheckedStatus();
  }
  handleCheckChanged(): void {
    let uncheckList = this.filteredList.filter((item) => item.checked != true);
    this.checked = uncheckList.length == 0;
    this.showMenu =
      uncheckList.length > 0 && this.filteredList.length != uncheckList.length;
    this.indeterminate = uncheckList.length > 0 && this.showMenu;
    console.log(
      "handleCheckChanged",
      uncheckList,
      this.showMenu,
      this.checked,
      this.indeterminate
    );
  }
  buildAdAccountList() {
    let list = [];
    for (let mediaAccount of this.mediaAccountList) {
      for (let adAccount of mediaAccount.adAccounts) {
        list.push({
          ...adAccount,
          type: mediaAccount.type,
          createdAt: mediaAccount.createdAt,
          status: "active",
          mediaAccountId: mediaAccount.id,
          checked: false,
        });
      }
    }
    this.adAccountList = list;
    this.searchText = "";
    this.filteredList = [...list];
  }
}
