import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AppServices } from 'src/app/_services/app.service';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { ActivateUserComponent } from '../activate-user/activate-user.component';
import { UserManagementModalComponent } from 'src/app/common/modal/user-management-modal/user-management-modal.component';
import { IModalData } from 'src/app/common/models/brandSetup/brandSetup.model';
import { AssignBrandComponent } from '../assign-brand/assign-brand.component';
import { StorageService } from 'src/app/_services/storage.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { EventBusService } from 'src/app/_shared/event-bus.service';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  role: any;
  status: string;
  brands:string[];
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent {
  eventBusSub?: Subscription;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly UserData[] = [];
  listOfData: UserData[] = [];
  copylistOfData: UserData[] = [];
  searchText: string = '';
  
  setOfCheckedId = new Set<String>();
  userCount : number = 0;
  clientId: string = '';
  breadcrumb: any = [
    {
      name: "Settings",
      link: null
    },
    {
      name: "Users",
      link: null
    },
  ];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private appService: AppServices,
    private modal: NzModalService, 
    private guidelineModalRef : NzModalRef, 
    private viewContainerRef: ViewContainerRef, 
    private dynamicModalService: DynamicModalComponentService,
    private eventBusService: EventBusService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      if( user && user.roles.includes("INCIVUS_ADMIN")){
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      this.getUserList();

      this.eventBusService.readEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(action => {
        if( action.name === 'activated') {
          this.modal.closeAll();
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'User(s) activated successfully',
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.getUserList();
            }
          });
        } else if(action.name === 'deactivated') {
          this.modal.closeAll();
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'User(s) deactivated successfully',
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.getUserList();
            }
          });
        } else if( action.name === 'assign_brand') {
          this.modal.closeAll();
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Brand assigned successfully',
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.getUserList();
            }
          });
        }
      });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filter(){
    const targetValue: UserData[] = [];
    this.copylistOfData.forEach((value: any) => {
       if ( value["firstName"] && value["firstName"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())
          || value["lastName"] && value["lastName"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()) ) {
         targetValue.push(value);
       }
   });
   this.listOfData = targetValue;
  }

  getUserList(): void {
    this.appService.getAllUser(this.clientId).subscribe( data => {
      let response: any = data;
      if( response.length > 0) {
        this.listOfData = response;
        this.copylistOfData = this.listOfData;
        this.userCount = response.length;
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
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly UserData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  addNewRole(): void {
    this.router.navigate(["client", "user","create"]);
  }

  editUser(userId: string): void {
    this.router.navigate(["client", "user", userId]);
  }

  delete(): void {
    let idToDelete = [...this.setOfCheckedId];
    this.confirmDeleteAll(idToDelete); 
  }

  deleteUserId(id: string): void {
    this.confirmDeleteAll(id);
  }

  confirmDeleteAll(idsToDelete: any): void {
    this.modal.confirm({
      nzTitle: 'Confirm delete',
      nzContent: 'Do you really want to delete the user(s)',
      nzOkText: 'Yes',
      nzClassName: 'short-modal',
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        if( typeof idsToDelete === 'string') {
          this.deleteUser(idsToDelete);
        } else {
          if( idsToDelete.length === 1) {
            let deleteId: string = idsToDelete[0];
            this.deleteUser(deleteId);
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
      user: idsToDelete
    }
    this.appService.deleteUserAll(data).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "User(s) deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getUserList()
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete user(s), please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
  }

  deleteUser(userId: string): void {
    this.appService.deleteUser(userId).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "User deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getUserList()
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete user, please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => console.log('Info OK')
        });   
      }
    });
  }

  activateUser() : void {
    let idsToActivate = [...this.setOfCheckedId];
    this.dynamicModalService.setUserIds(idsToActivate);
    this.createComponentModal('Activate User', ActivateUserComponent);
    this.dynamicModalService.updateModalCotentComponent();
  }

  assignBrand() : void {
    let idsToActivate = [...this.setOfCheckedId];
    this.dynamicModalService.setUserIds(idsToActivate);
    this.createComponentModal('Assign brands', AssignBrandComponent);
    this.dynamicModalService.updateModalCotentComponent();
  }

  createComponentModal(title:string, component:any): void {
    this.guidelineModalRef = this.modal.create<UserManagementModalComponent, IModalData>({
      nzTitle: title,
      nzContent: UserManagementModalComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzData: {
        title,
        displayComponent:component
      },
      nzFooter:null
    });
    const instance = this.guidelineModalRef.getContentComponent();
  }
}
