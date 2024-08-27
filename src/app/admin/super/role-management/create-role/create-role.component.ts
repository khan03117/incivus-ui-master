import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { StorageService } from 'src/app/_services/storage.service';
import { AppServices } from 'src/app/_services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreateRoleComponent {
  
  addRoleForm = new FormGroup({
    roleName: new FormControl(''),
    email: new FormControl([]),
    permission: new FormControl([]),
    roleDescription:new FormControl('')
  });
  clientId: string = '';
  isLoading: boolean = true;
  permissionList: any = [];
  userList: any = [];
  roleId: any = [];
  rnBlur: boolean = false;
  submitted: boolean = false;
  roleResponse: any;
  warningMsg: string = "You can create roles and attach more than 1 permissions to it. A user can get 1 or more than 1 role in the system.";
  breadcrumb: any = [
    {
      name: "Settings",
      link: null
    },
    {
      name: "Roles",
      link: "/client/role"
    },
  ]

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private service: AppServices,
    private modal: NzModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      if( user && user.roles.includes("INCIVUS_ADMIN")){
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      this.roleId = this.route.snapshot.params["roleId"] ? this.route.snapshot.params["roleId"] : 'create';
      this.getDetailsList();
      if( this.roleId.toLowerCase() !== 'create') {
        this.breadcrumb.push({
          name: "Edit role",
          link: null
        });
        this.getRoleData();
      } else {
        this.breadcrumb.push({
          name: "Create new role",
          link: null
        });
        this.addRoleForm = this.formBuilder.group({
          roleName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]),
          email: new FormControl([]),
          permission: new FormControl([], [Validators.required]),
          roleDescription:new FormControl('', [Validators.maxLength(500)])
        });
        this.isLoading = false;
      }
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addRoleForm.controls;
  }

  getRoleData() : void {
    this.service.getRoleDetails(this.roleId).subscribe({
      next: data => {
        let response:any = data;
        this.roleResponse = data;
        this.addRoleForm = this.formBuilder.group({
          roleName: new FormControl({value: response.role, disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]{1,}$/)]),
          email: new FormControl(response.users),
          permission: new FormControl(response.permission, [Validators.required]),
          roleDescription:new FormControl(response.description, [Validators.maxLength(500)])
        });
        this.isLoading = false;
      }
    })
  }

  getDetailsList() {
    this.service.getCreateRoleData(this.clientId).subscribe({
      next: data => {
        let response: any = data;
        this.permissionList = response.permission;
        this.userList = response.user;
        if( !(response.permission && response.permission.length > 0)) {
          this.modal.info({
            nzTitle: 'Attention',
            nzContent: 'Please create permission in order to create roles',
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.router.navigate(["client", "permission", "create"]);
            }
          });
        }
      }
    });  
  }

  save = () => {
    this.submitted = true;
    if( this.addRoleForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;
    let roleData: any = this.addRoleForm.value;
    roleData['clientId'] = this.clientId;

    this.service.createRole(roleData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Role created successfully',
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "role"]);
          }
        });
      },
      error: (err:any) => {
        if( err && err.error && err.error.errorCode === "ROLENAME_EXIST") {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'Role name already exist',
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {}  
          });
        } else {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'We are facing some technical issue pleae try again later',
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {}  
          });
        }
      }
    })
  }

  update = () => {
    this.submitted = true;
    if( this.addRoleForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;
    let roleData: any = this.addRoleForm.value;
    roleData['clientId'] = this.clientId;
    roleData['id'] = this.roleId;

    let prevRoleList = this.roleResponse.users;
    let newRoleList = roleData.email;
    let removedUsers: string[] = [];
    prevRoleList.forEach( (user: string) => {
      if( newRoleList.indexOf(user) === -1) {
        removedUsers.push(user);
      }
    });
    roleData.removedEmail = removedUsers;

    this.service.editRole(roleData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Role updated successfully',
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "role"]);
          }
        });
      }
    })
  }

  cancel = () => {
    this.router.navigate(["client", "role"]);
  }
}
