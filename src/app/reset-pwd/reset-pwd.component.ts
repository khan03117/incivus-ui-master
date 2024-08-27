import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AppServices } from '../_services/app.service';
import { CustomValidation } from '../_services/custom-validator.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.less']
})
export class ResetPwdComponent implements OnInit {
  resetPwdForm: FormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  confResetPwd: boolean = false;
  pBlur: boolean = false;
  cpBlur: boolean = false;
  submitted: boolean = false;
  isLoading: boolean = true;
  tokenId: String = '';
  userId: String = '';
  invalid_token_user: boolean = false;
  valid_token_user: boolean = false;
  reset_password_success: boolean = false;
  errorMsg: String = '';

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppServices
  ){}

  ngOnInit() : void {
    setTimeout( () => {
      this.validateRequest();
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.resetPwdForm.controls;
  }

  validateRequest() : void {
    this.tokenId = this.route.snapshot.params["tokenId"] ? this.route.snapshot.params["tokenId"] : '';
    this.userId = this.route.snapshot.params["userId"] ? this.route.snapshot.params["userId"] : '';
    if ( this.userId && this.tokenId ) {
      this.appService.validateResetLink(this.tokenId, this.userId).subscribe({
        next: data => {
          this.resetPwdForm = this.formBuilder.group({
            password: ["", [Validators.required , Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/)]],
            confirmPassword: ["", [Validators.required]]
          },{
            validators: [CustomValidation.match('password', 'confirmPassword')]
          });
          this.valid_token_user = true;
          this.isLoading = false;
        },
        error: err => {
          this.invalid_token_user = true;
          this.isLoading = false;
        }
      })
    } else {
      this.invalid_token_user = true;
      this.isLoading = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    if( this.resetPwdForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;
    const { password } = this.resetPwdForm.value;
    let resetPwdInput = {
      "password": password,
      "token": this.tokenId,
      "userId": this.userId
    };

    this.appService.resetPassword(resetPwdInput).subscribe({
      next: data => {
        this.invalid_token_user = false;
        this.valid_token_user = false;
        this.reset_password_success = true;
      },
      error: err => {
        if ( err && err.error && err.error.errorCode ) {
          this.errorMsg = 'The reset password link you have is expired or wrong. Please contact your admin.'
        } else {
          this.errorMsg = 'We are facing some glitches, please try again later.'
        }
      }
    })
  }

  gotoLogin() : void {
    this.router.navigate(['login']);
  }

}
