import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from '../../../_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StorageService } from 'src/app/_services/storage.service';

interface TableData {
  id: string;
  companyName: string;
  createdBy: string;
  createdOn: string;
  status: string;
  features: string;
  isClientAdmin: boolean;
  isBothAdmin: boolean;
}

interface ClientCreatives {
  id: string;
  companyName: string;
}

@Component({
  selector: "app-client-list",
  templateUrl: "./clientList.component.html",
  styleUrls: ["./clientList.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientListComponent {
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly TableData[] = [];
  listOfData: TableData[] = [];
  clientList: any[] = [];
  copylistOfData: TableData[] = [];
  setOfCheckedId = new Set<String>();
  searchText: string = "";
  user: any = {};

  constructor(
    private router: Router,
    private appService: AppServices,
    private modal: NzModalService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.user = this.storage.getUser();

      this.storage.saveUser(this.user);
      this.getClientList();
    }, 10);
  }

  filter() {
    const targetValue: TableData[] = [];
    this.copylistOfData.forEach((value: any) => {
      if (
        value["companyName"] &&
        value["companyName"]
          .toString()
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
      ) {
        targetValue.push(value);
      }
    });
    this.listOfData = targetValue;
  }

  getClientList(): void {
    this.appService.getClientList().subscribe((data) => {
      let response: any = data;
      if (response.length > 0) {
        this.listOfData = response;
        this.clientList = response;
        this.storage.saveClientList(this.clientList);
        this.copylistOfData = [...this.listOfData];
      } else {
        this.listOfData = [];
      }
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly TableData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  addNewCompany(): void {
    this.router.navigate(["client", "manage", "new"]);
  }

  edit(): void {
    const [first] = this.setOfCheckedId;
    this.editClient(first);
  }

  delete(): void {
    const [first] = this.setOfCheckedId;
    this.deleteClient(first);
  }

  editClient(clientId: String): void {
    this.router.navigate(["client", "manage", clientId]);
  }

  deleteClient(clientId: String): void {
    this.appService.deleteClient(clientId).subscribe({
      next: (data) => {
        this.modal.info({
          nzTitle: "Success",
          nzContent: "Client deleted successfully",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnCancel: () => {
            this.getClientList();
          },
          nzOnOk: () => {
            this.getClientList();
          },
        });
      },
      error: (err) => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "Unable to delete client, please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log("Info OK"),
        });
      },
    });
  }

  downloadReport(): void {
    this.appService.getClientExcel().subscribe((fileData) => {
      const blob: any = new Blob([fileData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let link = document.createElement("a");

      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "clientReport");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  setUserClient(clientId:string, companyName: string) {

    var featureAccess: any = {};
    for (let i = 0; i < this.clientList.length; i++) {
      const item = this.clientList[i];
      if (item.id == clientId) {
        featureAccess.serviceRequest =
          item.features?.includes("Service Request") ?? false;
        break;
      }
    }
    
    this.user.client = { id: clientId, companyName: companyName, featureAccess };

    this.storage.saveUser(this.user);
  }

  clientSetup(clientId: string, companyName:string) {
    this.setUserClient(clientId, companyName);
    this.router.navigate(["client", "company"]);
  }

  AddPermission(clientId: string, companyName:string) {
    this.setUserClient(clientId, companyName);
    this.router.navigate(["client", "permission"]);
  }

  addRoles(clientId: string, companyName:string) {
    this.setUserClient(clientId, companyName);
    this.router.navigate(["client", "role"]);
  }

  addUser(clientId: string, companyName:string) {
    this.setUserClient(clientId, companyName);
    this.router.navigate(["client", "user"]);
  }
}
