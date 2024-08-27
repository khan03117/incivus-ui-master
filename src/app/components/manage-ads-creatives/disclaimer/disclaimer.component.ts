import { Component, ViewEncapsulation, ViewContainerRef, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppServices } from 'src/app/_services/app.service';
import { StorageService } from 'src/app/_services/storage.service';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { thumbMotion } from 'ng-zorro-antd/core/animation';
 
 
 
@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.less'],
  encapsulation: ViewEncapsulation.None
 
})
export class DisclaimerComponent {
 
  user: any = {};
  currentDate: string;
  UserObj: any;
  artifactId:string;
  creatives:any={};
  type:string='';
  id:string;
  @Input() public data?:any;
  @Input() public createAction: boolean = false;
  @Input() public myCallback: Function = () => {};
 
  constructor(
    private router: Router,
    private storage: StorageService,
    private service: AppServices,
    private dynamicModalService: DynamicModalComponentService,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private route: ActivatedRoute
 
  ){}
 
  ngOnInit(): void{
    setTimeout(() => {
      this.user=this.storage.getUser();
      this.id=this.data.data;
      this.type=this.data.value;
      
      this.UserObj= this.user ;
    }, 10);
  }
 
 
 
  acceptPolicy=(id:string)=>{
    
    this.service.editDisclaimer(this.user.id,"accept").subscribe( {
      next: data => {
      this.user.disclaimerAccDate=String(data);
      this.storage.saveUser(this.user);
      this.dynamicModalService.closeModal();
      if(this.type==='creative')this.router.navigate(['reports',id]);
      if(this.type==='report'){
        this.router.navigate([`compare/report/${id}`])
      }
      if(this.type==='compare_report'){
        this.router.navigate(["compare", "report", "create"]);

      }

  
      },
      error: err => {
        console.log(err);
      }
    });
    
  }
 
 
  modalClassName: string = 'modalClass';
 
  declinePolicy(){
    this.dynamicModalService.closeModal();
    this.user.disclaimerAccDate=null;
    this.storage.saveUser(this.user);
    let className = 'report-details-modal';  
    this.modal.error({
      nzContent: `<h6>DISCLAIMER</h6><br><p>Please accept the disclaimer notice to move ahead and review the Ad Report.</p> <p>If you have any queries, please feel free to reach us at <a href="mailto:support@incivus.ai">support@incivus.ai.</a> </p>`,
      nzMaskClosable: false,
      nzClassName: 'sm',
      nzKeyboard: false,
      nzWidth: '37rem',
      nzOnOk: () => console.log('Disclaimer Decline')
    })
    localStorage.setItem('value', 'decline');
  }

}

