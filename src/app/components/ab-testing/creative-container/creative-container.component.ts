import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CreateFolderComponent } from '../create-folder/create-folder.component';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { AppServices } from 'src/app/_services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StorageService } from 'src/app/_services/storage.service';
import { DisclaimerComponent } from '../../manage-ads-creatives/disclaimer/disclaimer.component';
 
 
interface ReportData {
  id: string;
  title: string;
  userId: string;
  createdBy: string;
  createdOn: string;
  adIds: any;
  compareType: string;
}
 
@Component({
  selector: 'app-creative-container',
  templateUrl: './creative-container.component.html',
  styleUrls: ['./creative-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreativeContainerComponent {
  creatives: any = [];
  filterList: string = '';
  isVideoAllowed: boolean = true;
  isImageAllowed: boolean = true;
  isImageReportAllowed: boolean = true;
  isVideoReportAllowed: boolean = true;
  createAction: boolean = false;
  listOfCurrentPageData: readonly ReportData[] = [];
  listOfData: ReportData[] = [];
  copylistOfData: ReportData[] = [];
  setOfCheckedId = new Set<string>();
  searchText: string = '';
  checked = false;
  indeterminate = false;
  currentDate:string="";
  timeperiod=100;
  timeperiod1:Date;
  brands:any={};
  brandSelected:string= '';
  brandCreatives:any={};
  user:any={};
  allBrands:string='';
  artifactId:string=''
  warningMsg: string = "You can compare video and image creatives by first filtering by Ad type.";
  breadcrumb: any = [
    {
      name: "A/B Testing",
      link: null
    },
    {
      name: "Creatives",
      link: null
    }
  ];
  
  constructor(
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private service: AppServices,
    private modal: NzModalService,
    private router: Router,
    private storageService:StorageService,
    private dynamicServiceModal:DynamicModalComponentService
  ) {}
 
  ngOnInit() {
    setTimeout( () => {
      console.log('in creative container')
      this.getAllCreatives();
      this.getReportList();
      this.user=this.storageService.getUser();
      this.brands=this.user.brands;
      if(this.user.disclaimerAccDate!=null){
        this.getCurrentDate();
        this.timeperiod1= new Date(this.user.disclaimerAccDate);
        this.getDiff();
      }else{
        this.timeperiod=100;
      }
      if( this.user && this.user.client && this.user.client.featureAccess) {
        if( this.user.client.featureAccess.imageAd?.isABTest) {
          this.isImageAllowed = true;
        } else {
          this.isImageAllowed = false;
        }
        if( this.user.client.featureAccess.videoAd?.isABTest) {
          this.isVideoAllowed = true;
        } else {
          this.isVideoAllowed = false;
        }
        if( this.user.client.featureAccess.imageAd?.abTest?.viewReport) {
          this.isImageReportAllowed = true;
        } else {
          this.isImageReportAllowed = false;
        }
        if( this.user.client.featureAccess.videoAd?.abTest?.viewReport) {
          this.isVideoReportAllowed = true;
        } else {
          this.isVideoReportAllowed = false;
        }
        if(!this.user.permission.viewABTestReport){
          this.isImageReportAllowed = false;
          this.isVideoReportAllowed = false;
        }
      }
      if( this.isVideoAllowed ) {
        this.filterList = 'video';
      } else {
        this.filterList = 'image';
      }
    }, 10);
  }
 
  getReportList(): void {
    this.service.getCompare().subscribe( data => {
      let response: any = data;
      if( response.length > 0) {
        this.listOfData = response;
        this.copylistOfData = [...this.listOfData];
      } else {
        this.listOfData = [];
      }

      for(var i=0;i<this.listOfData.length;i++){
          console.log('data-> ', this.listOfData[i].adIds);
      } 
    });
  }

 
  filter(){
    const targetValue: ReportData[] = [];
    this.copylistOfData.forEach((value: any) => {
       if (value["title"] && value["title"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())) {
         targetValue.push(value);
       }
   });
   this.listOfData = targetValue;
  }
 
  getAllCreatives() {
    this.service.getAllCompleted().subscribe({
      next: (data: any) => {
        this.creatives = data;
        this.brandCreatives=this.creatives;
     //   this.filterList = 'video'
        if( this.isVideoAllowed ) {
          this.filterList = 'video';
        } else {
          this.filterList = 'image';
        }
      },
      error: err => {
        
      }
    })
  }
 
  filterCreatives(filter: any) {
    this.filterList = filter;
  }

  filterBrands(brand: any) {
    this.brandSelected=brand;
    this.getBrandCreatives();
  }

  getBrandCreatives(){

    if(this.brandSelected!=='all'){
    this.brandCreatives=this.creatives.filter((data:any)=>{
      return data.metadata.brand.toLocaleLowerCase()===this.brandSelected;
    })
  }else{
    this.brandCreatives=this.creatives;
  }
  }
  
 
  reset = () => {
    setTimeout( () => {
      this.createAction = false;
    }, 10);
  }
 
  createCompare() {
    this.createAction = true;
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
 
  onCurrentPageDataChange($event: readonly ReportData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }
 
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  
  openCreateFolderModal(){
    this.dynamicModalService.createComponentModal('', CreateFolderComponent, this.viewContainerRef);
    this.dynamicModalService.updateModalCotentComponent(MODALCOMPONENT.CREATE_FOLDER);
  }
 
  delete(): void {
    let idToDelete = [...this.setOfCheckedId];
    this.confirmDeleteAll(idToDelete);
  }
 
  confirmDeleteAll(idsToDelete: any) {
    this.modal.confirm({
        nzTitle: 'Confirm delete',
        nzContent: 'Do you really want to delete the A/B test report(s)',
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
      compareIds: idsToDelete
    }
    this.service.deleteABReportsAll(data).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "A/B report(s) deleted successfully",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getReportList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete A/B report(s), please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => console.log('Info OK')
        });
      }
    });
  }
 
  deleteClient(compareId: string): void {
    this.service.deleteABReport(compareId).subscribe( {
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: "A/B report(s) deleted successfully",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => {
            this.getReportList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: "Unable to delete A/B report(s), please try again later",
          nzClassName: "small-modal",
          nzMaskClosable: false,
          nzKeyboard: false,
          nzClosable: false,
          nzOnOk: () => console.log('Info OK')
        });   
      }
    });
  }
 
  viewReport(compareObj: any) {
    
    let data = {
      adSet: compareObj.adIds,
      title: compareObj.title,
      type: compareObj.compareType
    };
    localStorage.setItem("compareIds", JSON.stringify(data));
    
    this.router.navigate(["compare", "report", compareObj.id]);
  }
  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
    const timezoneOffset = currentDate.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, '0');
    const timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
    const timezoneSign = timezoneOffset < 0 ? '+' : '-';
 
    this.currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  }
 
  getDiff(){
    const t1= this.timeperiod1;
    const t2= new Date(this.currentDate);
 
    const timeDiff=Math.abs(t1.getTime()-t2.getTime());
    const daysDiff=(timeDiff/(1000*60*60*24));
    this.timeperiod=daysDiff;
  }
 
  popup=(compareObj:any)=>{
    let className = 'report-details-modal';
    let data = {
      adSet: compareObj.adIds,
      title: compareObj.title,
      type: compareObj.compareType
    };
    localStorage.setItem("compareIds", JSON.stringify(data));
    this.dynamicServiceModal.createComponentModal('', DisclaimerComponent, this.viewContainerRef,{data:compareObj.id, value:'report'}, className)
  }
 
  finalPop=()=>{
    let className = 'report-details-modal';
    this.dynamicServiceModal.createComponentModal('', DisclaimerComponent, this.viewContainerRef,{data:null, value:'report'}, className)
  }
}