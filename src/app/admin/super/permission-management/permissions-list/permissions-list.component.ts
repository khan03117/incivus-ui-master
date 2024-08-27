import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';

interface PermissionData {
  id: string;
  name: string;
  createdOn: string;
  createdBy: string;
  roleCount: number;
  roleList: string[];
}

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionsListComponent {
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly PermissionData[] = [];
  listOfData: PermissionData[] = [];
  copylistOfData: PermissionData[] = [];
  setOfCheckedId = new Set<string>();
  rolesCount : number = 0;
  clientId: string = '';
  searchText: string = '';
  companyName: string = '';
  breadcrumb: any = [
    {
      name: "Settings",
      link: null
    },
    {
      name: "Permissions",
      link: null
    },
  ]

  constructor(
    private router: Router,
    private appService: AppServices,
    private storage: StorageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      if( user && user.roles.includes("INCIVUS_ADMIN")){
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      this.companyName = user.client.companyName;
      this.getPermissionList();
    }, 10);
  }

  filter(){
    const targetValue: PermissionData[] = [];
    this.copylistOfData.forEach((value: any) => {
       if (value["name"] && value["name"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())) {
         targetValue.push(value);
       }
   });
   this.listOfData = targetValue;
  }

  test(): void{
    console.log(this.searchText);
  }

  getPermissionList(): void {
    this.appService.getAllPermission(this.clientId).subscribe( data => {
      let response: any = data; 
      if( response.length > 0) {
        this.listOfData = response;
        this.rolesCount = response.length;
        this.copylistOfData = [...this.listOfData];
      } else {
        this.listOfData = [];
      }
    });
  }

  edit(): void {
    const [first] = this.setOfCheckedId;
    this.editClient(first);
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
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly PermissionData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  addNewPermissions(): void {
    this.router.navigate(["client", "permission", "create"]);
  }

  editClient(permissionId: string): void {
    this.router.navigate(["client", "permission", permissionId]);
  }

  delete(): void {
    let idToDelete = [...this.setOfCheckedId];
    this.confirmDeleteAll(idToDelete); 
  }

  confirmDeleteAll(idsToDelete: any) {
    this.modal.confirm({
        nzTitle: 'Confirm delete',
        nzContent: 'Do you really want to delete, deleting permissions will have impact on roles assosciated with it and eventually impact the associated user logins',
        nzOkText: 'Yes',
        nzClassName: 'short-modal',
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          if( typeof idsToDelete === 'string') {
            this.deleteClient(idsToDelete);
          } else {
            if( idsToDelete.length === 1) {
              let deleteId: string = idsToDelete[0];
              this.deleteClient(deleteId);
            } else {
              this.deleteAll(idsToDelete);
            }
          }
        },
        nzCancelText: 'No',
        nzOnCancel: () => true
      });
  }

  deleteAll(idsToDelete: any) {
    let data: any = {
      permission: idsToDelete
    }
    this.appService.deletePermissionAll(data).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "Permission(s) deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getPermissionList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete permission(s), please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
  }

  deleteClient(permissionId: string): void {
    this.appService.deletePermission(permissionId).subscribe( {
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "Permission deleted successfully",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => {
            this.getPermissionList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete permission, please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => console.log('Info OK')
        });   
      }
    });
  }
}
