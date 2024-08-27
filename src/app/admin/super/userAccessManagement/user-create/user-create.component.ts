import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserCreateComponent {
  
  addUserForm = new FormGroup({
    firstName:new FormControl(''),
    lastName: new FormControl(''),
    emailId: new FormControl(''),
    status: new FormControl(''),
    role: new FormControl(''),
    brands: new FormControl([])
  });
  clientId: string = '';
  userId: string = '';
  roles: any = [];
  submitted: boolean = false;
  brandDetails: any = [];
  isLoading: boolean = true;
  userDetails: any = {};
  breadcrumb: any = [
    {
      name: "Settings",
      link: null
    },
    {
      name: "Users",
      link: "/client/user"
    },
  ]

  constructor(
    private service: AppServices,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    setTimeout( () => {
      let user = this.storage.getUser();
      if( user && user.roles.includes("INCIVUS_ADMIN")){
        this.breadcrumb[0].link = "/client/list";
      }
      this.clientId = user.client.id;
      // this.brandDetails = user.client.brandDetails;
      this.getBrandDetails();
      this.userId = this.route.snapshot.params["userId"] ? this.route.snapshot.params["userId"] : 'create';
      this.getRoles();
      if( this.userId.toLowerCase() !== 'create') {
        this.breadcrumb.push({
          name: "Edit user",
          link: null
        });
        this.getUserDetails();
      } else {
        this.breadcrumb.push({
          name: "Create new user",
          link: null
        });
        this.addUserForm = this.formBuilder.group({
          firstName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]),
          lastName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{0,}$/)]),
          emailId: new FormControl('', [Validators.required, Validators.email]),
          status: new FormControl('', [Validators.required]),
          role: new FormControl('', [Validators.required]),
          brands: new FormControl([], [Validators.required])
        });
        this.isLoading = false;
      }
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addUserForm.controls;
  }

  getBrandDetails(): void {
    this.service.getClientDetails(this.clientId).subscribe({
      next: (data:any) => {
        this.brandDetails = data.client.brandDetails;
      },
      error: err => {
        return [];
      }
    })
  }
  getUserDetails(): void {
    this.service.getUserDetails(this.userId).subscribe({
      next: data => {
        let response:any = data;
        this.addUserForm = this.formBuilder.group({
          firstName: new FormControl({value: response.firstName, disabled: true}, [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]),
          lastName: new FormControl({value: response.lastName, disabled: true}, [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]{1,}$/)]),
          emailId: new FormControl({value: response.email, disabled: true}, [Validators.required, Validators.email]),
          status: new FormControl(response.status, [Validators.required]),
          role: new FormControl(response.role ? response.role.role : '', [Validators.required]),
          brands: new FormControl(response.brands, [Validators.required])
        });
        this.userDetails = response;
        this.isLoading = false;
      }
    })
  }

  getRoles() : any {
    this.service.getAllRoles(this.clientId).subscribe({
      next: data => {
        this.roles = data;
      },
      error: err => {
        this.roles = [];
      }
    })
  }

  save = () => {
    this.submitted = true;
    if( this.addUserForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;

    let userData:any = this.addUserForm.value;
    userData['clientId'] = this.clientId;
    this.service.saveUser(userData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'User created successfully',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "user"]);
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: err.error.error + '::' + err.error.message,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });

  }

  update = () => {
    this.submitted = true;
    if( this.addUserForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;

    let userData:any = this.addUserForm.value;
    userData['emailId'] = this.userDetails.email;
    userData['clientId'] = this.clientId;
    userData['id'] = this.userId;
    userData['firstName'] = this.userDetails.firstName;
    userData['lastName'] = this.userDetails.lastName;
    console.log("admin user", userData);
    
    
    this.service.editUser(userData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'User updated successfully',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.router.navigate(["client", "user"]);
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: err.error.error + '::' + err.error.message,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
  }

  cancel = () => {
    this.router.navigate(["client", "user"]);
  }


}
