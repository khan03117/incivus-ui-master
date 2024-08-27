import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UploadCreativeModalComponent } from '../upload-creative-modal/upload-creative-modal.component';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { AppServices } from 'src/app/_services/app.service';
import { ActivatedRoute } from '@angular/router';
import { EventBusService } from '../../../_shared/event-bus.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventData } from 'src/app/_shared/event.class';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/_services/storage.service';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
 
interface MetaData {
  id: string;
  title: string;
  artifactType: string;
  status:number;
  uploadedAt:string;
  thumbnail:string;
  name:string;
  createdBy:string;
}
 
interface ArtifactResponse {
  metadata: MetaData,
  url: string
}
 
@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignDetailsComponent {
  checked = false;
  indeterminate = false;
  warningMsg:string = "You can upload Ads at any time after a campaign is created."
  listOfCurrentPageData: readonly ArtifactResponse[] = [];
  listOfData: ArtifactResponse[] = [];
  copylistOfData: ArtifactResponse[] = [];
  searchText: string = '';
  setOfCheckedId = new Set<String>();
  adsCount : number = 0;
  campaignName: string = '';
  brand: string = '';
  eventBusSub?: Subscription;
  user: any = {};
  client: any = {};
  currentDate:string='';
  timeperiod1:Date;
  timeperiod=100;
  isAnalyze: boolean = false;
 
  breadcrumb: any = [
    {
      name: "Campaign",
      link: "/creatives/pre-flight/list",
    },
  ];
  private ngUnsubscribe = new Subject<void>();
 
  constructor(
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private service: AppServices,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private serviceBus: EventBusService,
    private storage: StorageService,
    private router: Router,
    private dynamicServiceModal:DynamicModalComponentService
  ) {}
 
  ngOnInit(): void {
    setTimeout( () => {
      this.user = this.storage.getUser();
      this.client = this.user.client;
      this.isAnalyze = this.user.permission.isAnalyze;
      if(this.user.disclaimerAccDate!=null){
        this.getCurrentDate();
        this.timeperiod1= new Date(this.user.disclaimerAccDate);
        this.getDiff();
      }else{
        this.timeperiod=100;
      }
      this.campaignName = this.route.snapshot.params["campaignName"];
      this.brand = this.route.snapshot.params["brand"];
      this.breadcrumb.push({'name': this.capitalizeFirstLetter(this.campaignName), 'link': null});
      this.getAdsList();
      this.serviceBus.readEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(action => {
        if( action.name === 'creative_campaign_created') {
          this.getAdsList();
        }
      });
    }, 10);
  }
 
  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
 
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
 
  filter(){
    const targetValue: ArtifactResponse[] = [];
    this.copylistOfData.forEach((value: any) => {
      if (value.metadata["title"] && value.metadata["title"].toString().toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())) {
        targetValue.push(value);
      }
   });
   this.listOfData = targetValue;
  }
 
  getAdsList(): void {
    this.service.getCampaignCreatives(this.campaignName).subscribe( ( data: any) => {
      let response: ArtifactResponse[] = data.ads;
      if( response.length > 0) {
        this.listOfData = response;
        this.adsCount = response.length;
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
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.metadata.id, value));
    this.refreshCheckedStatus();
  }
 
  onCurrentPageDataChange($event: readonly ArtifactResponse[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }
 
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.metadata.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.metadata.id)) && !this.checked;
  }
 
  analyze = (artifactId: string) => {
    this.service.analyzeCreative(artifactId).subscribe({
      next: (data:any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "We are analyzing the creative now. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getAdsList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are unable to analyze it, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {}
        });
      }
    });
  }
 
  reanalyze = (artifactId: string) => {
    this.service.retryAnalyzeCreative(artifactId).subscribe({
      next: (data:any) => {
        this.modal.success({
          nzTitle: "Success",
          nzContent: "We have reinitiated the analysis. Check back in few minutes for the report.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.getAdsList();
          }
        });
      },
      error: err => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are unable to reinitiate the analysis now, please try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {}
        });
      }
    });
  }
 
  report = (id: string) => {
    this.router.navigate(['reports', id]);
  }
 
  uploadCreatives(){
    this.dynamicModalService.setCampaign({"campaignName": this.campaignName, "brand": this.brand});
    this.dynamicModalService.createComponentModal('', UploadCreativeModalComponent, this.viewContainerRef, {}, 'uploadCreativeModal');
    this.dynamicModalService.updateModalCotentComponent(MODALCOMPONENT.UPLOAD_CREATIVE);
  }
 
  showReport(score: number, type: string) : boolean {
    if( type === 'image') {
      if( this.client.featureAccess.imageAd.analyze.viewReport ) {
        if( this.user.permission.viewSummaryPage || this.user.permission.viewFullReport ) {
          if( score == 100) {
            return true;
          }
        }
      }
    } else {
      if( this.client.featureAccess.videoAd.analyze.viewReport ) {
        if( this.user.permission.viewSummaryPage || this.user.permission.viewFullReport ) {
          if( score == 100) {
            return true;
          }
        }
      }
    }
    return false;
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
 
  popup=(id:string)=>{
    let className = 'report-details-modal';
    this.dynamicServiceModal.createComponentModal('', DisclaimerComponent, this.viewContainerRef, {data:id, value:'creative'}, className)
  }

  openCreative(id:string){
    console.log('id', id);
   this.router.navigate(["creatives", id]);
  }
}
 