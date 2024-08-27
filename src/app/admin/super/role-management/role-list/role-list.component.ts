import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';

interface RoleData {
  id: string;
  role: string;
  permission: string[]|null|undefined;
  createdOn: string;
  createdBy: string;
  userCount: number;
}

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RoleListComponent {
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly RoleData[] = [];
  listOfData: RoleData[] = [];
  copylistOfData: RoleData[] = [];
  setOfCheckedId = new Set<string>();
  rolesCount : number = 0;
  clientId: string = '';
  searchText: string = '';
  breadcrumb: any = [
    {
      name: "Settings",
      link: null
    },
    {
      name: "Roles",
      link: null
    },
  ];

  constructor(
    private router: Router,
    private appService: AppServices,
    private storage: StorageService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      if( user && user.roles.includes("INCIVUS_ADMIN")){
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      this.getRoleList();
    }, 10);
  }

  ngAfterVidewChecked() {
    this.cdr.detectChanges();
  }

  filter(){
    const targetValue: RoleData[] = [];
    this.copylistOfData.forEach((value: any) => {
      if (value["role"] && value["role"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())
        || value["permission"] && value["permission"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()) ) {
        targetValue.push(value);
      }
   });
   this.listOfData = targetValue;
  }

  getRoleList(): void {
    this.appService.getAllRoles(this.clientId).subscribe( data => {
      let response: any = data;
      if( response.length > 0) {
        this.listOfData = response;
        this.copylistOfData = [...this.listOfData];
        this.rolesCount = response.length;
      } else {
        this.listOfData = [];
        this.rolesCount = 0;
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
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly RoleData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  addNewRole(): void {
    this.router.navigate(["client", "role", "create"]);
  }

  edit(): void {
    const [first] = this.setOfCheckedId;
    this.editClient(first);
  }

  delete(): void {
    let idToDelete = [...this.setOfCheckedId];
    this.confirmDeleteAll(idToDelete); 
  }

  confirmDeleteAll(idsToDelete: any) {
    this.modal.confirm({
        nzTitle: 'Confirm delete',
        nzContent: 'Do you really want to delete, deleting roles will have impact on users assosciated with it and eventually impact logins',
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
      role: idsToDelete
    }
    this.appService.deleteRoleAll(data).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "Role(s) deleted successfully",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => {
            this.getRoleList()
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete role(s), please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
  }

  editClient(roleId: string): void {
    this.router.navigate(["client", "role", roleId]);
  }

  deleteClient(roleId: string): void {
    this.appService.deleteRole(roleId).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "Role deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getRoleList()
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete role, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });   
      }
    });
  }
}
