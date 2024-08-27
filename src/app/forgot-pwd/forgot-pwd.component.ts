import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServices } from '../_services/app.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.less']
})
export class ForgotPwdComponent implements OnInit {
  forgotPwdForm: FormGroup = new FormGroup({
    username: new FormControl('')
  });
  confForgotPwd: boolean = false;
  unBlur: boolean = false;
  submitted: boolean = false;
  errorMsg: string = '';
  rnBlur: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appService: AppServices
  ){}

  ngOnInit() : void {
    setTimeout( () => {
      this.forgotPwdForm = this.formBuilder.group({
        username: ["", [Validators.required, Validators.email]]
      });
    }, 10);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.forgotPwdForm.controls;
  }

  login() : void {
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.errorMsg = '';
    this.submitted = true;
    if( this.forgotPwdForm.status.toLowerCase() === 'invalid') {
      return;
    }
    this.submitted = false;

    const { username } = this.forgotPwdForm.value;
    
    this.appService.forgotPwd(username).subscribe({
      next: data => {
        this.confForgotPwd = true;
      },
      error: err => {
        let errorMsg = 'We are facing some glitches, please try again later.'
        if( err && err.error && err.error.errorCode === 'EMAIL_NOT_EXIST'){
          errorMsg = "Email provided does not exist, please check and try again."
        }
        this.errorMsg = errorMsg;
      }
    })
    
  }

}
