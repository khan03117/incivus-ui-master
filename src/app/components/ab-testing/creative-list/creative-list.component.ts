import { Component, ViewChild, ViewEncapsulation, ElementRef, Input, SimpleChanges, ViewContainerRef  } from '@angular/core';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { AppServices } from 'src/app/_services/app.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { DisclaimerComponent } from '../../manage-ads-creatives/disclaimer/disclaimer.component';
import { StorageService } from 'src/app/_services/storage.service';



interface ItemData {
  id: string;
  brand: string;
}
 
@Component({
  selector: 'app-creative-list-abtest',
  templateUrl: './creative-list.component.html',
  styleUrls: ['./creative-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
 
export class CreativeListComponent {
  @Input() public creativeData:any = [];
  @Input() public filterList:string = '';
  @Input() public createAction: boolean = false;
  @Input() public myCallback: Function = () => {};
  finalCreativeData: any = [];
  campaignData: any = [];
  creativeSlideData:any=[];
  campaignSlideData:any=[];
  sharedCampaignData: any = [];
  setOfCheckedId = new Set<ItemData>();
  user:any={};
  timeperiod1:Date;
  timeperiod=100;
  currentDate:string='';
  creativeOptions: OwlOptions = {
    autoWidth: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    margin : 16,
    responsive: {
      1024: {
        items: 4
      }
    },
    nav: true,
    navText:['<span class="arrow-left"></span>', '<span class="arrow-right"></span>']
  };
  campaignOptions: OwlOptions = {
    autoWidth: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    margin : 16,
    responsive: {
      1024: {
        items: 8
      }
    },
    nav: true,
    navText:['<span class="arrow-left"></span>', '<span class="arrow-right"></span>']
  };
  isIncAdmin: boolean = false;
  isTrialUser: boolean = false;
  
  @ViewChild('creativeCarousel', { static: true }) public creativeSlides!: CarouselComponent;
  @ViewChild('campaignCarousel', { static: true }) public campaignSlides!: CarouselComponent;
 
  constructor(
    private el: ElementRef,
    private eventBusService: EventBusService,
    private service: AppServices,
    private router: Router,
    private modal: NzModalService,
    private dynamicServiceModal: DynamicModalComponentService,
    private viewContainerRef: ViewContainerRef,
    private storage: StorageService
  
  ){}
 
  ngOnInit() {
    setTimeout( () => {
      this.user= this.storage.getUser();
      if(this.user.disclaimerAccDate!=null){
        this.getCurrentDate();
        this.timeperiod1= new Date(this.user.disclaimerAccDate);
        this.getDiff();
      }else{
        this.timeperiod=100;
      }

    }, 10);
  }

  getDiff(){
    const t1= this.timeperiod1;
    const t2= new Date(this.currentDate);
 
    const timeDiff=Math.abs(t1.getTime()-t2.getTime());
    const daysDiff=(timeDiff/(1000*60*60*24));
    this.timeperiod=daysDiff;
  }
  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
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
  getCes(ces: number) : string {
    if( ces ) {
      return ((ces*100).toFixed(2)).toString();
    }
    return "";
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if( changes['createAction'] && changes['createAction'].currentValue && this.timeperiod<=90) {
      this.createCompare();
    }
    if( changes['createAction'] && changes['createAction'].currentValue && this.timeperiod>90) {
      this.createPopUp();
    }
    if( changes['filterList'] && changes['filterList'].currentValue) {
      if( changes['filterList'].currentValue === 'all') {
        this.finalCreativeData = this.creativeData;
      } else {
        this.finalCreativeData = this.creativeData.filter( (data: any) => {
          return data.metadata.artifactType.toLowerCase() === changes['filterList'].currentValue;
        });
      }
    }
    if( changes['creativeData'] && changes['creativeData'].currentValue) {
 
      this.finalCreativeData = this.creativeData.filter( (data: any) => {
          return data.metadata.artifactType.toLowerCase() === this.filterList;
      });
      // this.reInitCarousel(this.creativeSlides);
      // this.reInitCarousel(this.campaignSlides);
    }
    
  }
 
  updateCheckedSet(id: string, brand: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add({id: id, brand: brand});
    } else {
      this.setOfCheckedId.forEach(x => x.id === id ? this.setOfCheckedId.delete(x) : x);
    }
  }
 
  onItemChecked(id: string, brand: string, checked: boolean): void {
    this.updateCheckedSet(id, brand, checked);
  }
 
  createCompare() {
    if( this.setOfCheckedId.size < 2) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please select atleast 2 ads to initiate the compare.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {
          this.createAction = false;
          this.myCallback();
        }
      });
      return;
    }
    const selectedAd = [...this.setOfCheckedId];
    let data = {
      adSet: selectedAd,
      title: "",
      type: this.filterList
    };
    localStorage.setItem("compareIds", JSON.stringify(data));
    this.router.navigate(["compare", "report", "create"]);
  }
  createPopUp() {
    if( this.setOfCheckedId.size < 2) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please select atleast 2 ads to initiate the compare.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => {
          this.createAction = false;
          this.myCallback();
        }
      });
      return;
    }
    this.myCallback();    
    const selectedAd = [...this.setOfCheckedId];
    let data = {
      adSet: selectedAd,
      title: "",
      type: this.filterList
    };
    localStorage.setItem("compareIds", JSON.stringify(data));
    let className = 'report-details-modal';
    this.dynamicServiceModal.createComponentModal('', DisclaimerComponent, this.viewContainerRef,{data:data, value:'compare_report'}, className)
    

  }

  getCreativeData(data:SlidesOutputData) {
    this.creativeSlideData = data;
  }
 
  getCampaignData(data:SlidesOutputData) {
    this.campaignSlideData = data;
  }
 
  openShareCampaignModal(){
    // this.dynamicModalService.createComponentModal('', ShareCampaignComponent, this.viewContainerRef);
    // this.dynamicModalService.updateModalCotentComponent(MODALCOMPONENT.SHARE_CAMPAIGN);
  }
 
  reInitCarousel(slideObj:any) : void{
    const creativeService = slideObj as any;
    const creativeCarouselService = creativeService.carouselService as CarouselService;
 
    creativeCarouselService.refresh();
    creativeCarouselService.update();
  }
}
 
