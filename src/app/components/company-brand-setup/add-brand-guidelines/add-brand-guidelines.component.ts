import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DomSanitizer } from '@angular/platform-browser';
import { AppServices } from 'src/app/_services/app.service';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-add-brand-guidelines',
  templateUrl: './add-brand-guidelines.component.html',
  styleUrls: ['./add-brand-guidelines.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AddBrandGuidelinesComponent {
  logoList : any = [];
  logoListPreview: any = [];
  savedLogo: any = [];
  removedLogo: any = [];
  savedAudio: any = [];
  removedAudio: any = [];
  audioFileMeta: any =[];
  textSentiment: string = 'neutral';
  toneOfVoice_1: string = 'na';
  toneOfVoice_2: string = 'na';
  toneOfVoice_3: string = 'na';
  toneOfVoice_4: string = 'na';
  voice: string = '';
  keyword: string = '';
  keywordList:any = [];
  tagline: string = '';
  taglineList:any = [];
  colorcode: string = ''
  colorCodeList:any = [];
  emotionOption: any = [
    { label: "Neutral", value: "neutral", checked: false, disabled: false },
    { label: "Happy", value: "happy", checked: false, disabled: false },
    { label: "Sad", value: "sad", checked: false, disabled: false },
    { label: "Surprised", value: "surprised", checked: false, disabled: false },
    { label: "Scared", value: "scared", checked: false, disabled: false },
    { label: "Disgust", value: "disgust", checked: false, disabled: false },
    { label: "Angry", value: "angry", checked: false, disabled: false }
  ];
  productFormListObj: any = [
    "Bottle;Tin can",
    "Canned Packaged Goods",
    "Drink",
    "Packaged Goods;Tubed packaged goods; Bottled and jarred packaged goods",
    "Motorcycle;Bicycle;Car;Toy vehicle;Vehicle",
    "Kitchen Appliances",
    "Laptop;Mobile phone;Headphones;Digital Watches",
    "Microwave oven;Microwave;Refrigerator;AC;Juicer;Mixer",
    "Clothing;Outerwear;Jeans;Pants;Shorts;Coat;Belt;Top;Hat;Sun hat;Fedora;Scarf;cap",
    "Furniture",
    "Footwear;Shoe",
    "Food",
    "Lipstick;perfume",
    "Luggage & Baggage;Bag;Luggage & bags",
    "Glasses;Sunglasses",
    "Umbrella;Picture frame",
    "Cycle Wheel;Tire;Wheel"
  ];
  productForm: string = '';
  productFormList: any = [];
  signature: string = '';
  signatureList: any = [];
  signList : any = [];
  signListPreview: any = [];
  savedSign: any = [];
  removedSign: any = [];
  signatureType: string = 'text';
  masterBrand: string = '';
  productBrand: string = '';
  entity: any = [];
  subEntity: any = [];
  uploadInfo :any = { 
    showPreviewIcon: false, 
    showRemoveIcon:false, 
    showDownloadIcon: false
  }
  clientDetails: any = null;
  clientId: string = '';
  entityList: any = null;
  subEntityList: any = null;
  brandInQue: any = null;
  subEntityPH: string = 'Select';
  brandId: string = '';
  isLoading: boolean = true;
  bgResponse: any = null;
  name: string = '';
  saving: boolean = false;
  detailsError: string = '';
  emotionSelected: number = 0;
  awsLink: string = "https://ap-south-1-stage-ui-bucket.s3.ap-south-1.amazonaws.com";

  constructor(
    private sanitizer: DomSanitizer,
    private brandService: DynamicModalComponentService,
    private appService: AppServices,
    private eventBusService: EventBusService,
    private modal: NzModalService,
    @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit(): void {
    setTimeout( () => {

      this.document.body.classList.add('guidelineModal');

      let host = window.location.host;
      if( host.includes("testplatform")) {
        this.awsLink = "https://ap-south-1-test-ui-bucket.s3.ap-south-1.amazonaws.com";
      }
      this.clientDetails = this.brandService.getClientDetails();
      this.clientId = this.brandService.getClientId();
      if( this.clientDetails.entity && this.clientDetails.entity.length > 0) {
        this.entityList = this.clientDetails.entity;
      }
      this.brandInQue = this.brandService.getBrandGuideline();
      if( this.brandInQue.productBrand ) {
        if( this.brandInQue.productBrand.id ) {
          this.brandId = this.brandInQue.productBrand.id;
        }
        this.name = this.brandInQue.productBrand.name;
        this.masterBrand = this.brandInQue.masterBrand.name;
      } else if(this.brandInQue.masterBrand) {
        if(this.brandInQue.masterBrand.id) {
          this.brandId = this.brandInQue.masterBrand.id;
        }
        this.name = this.brandInQue.masterBrand.name;
      }

      if( this.brandId ) {
        this.getBrandGuidelines();
      } else {
        this.isLoading = false;
      }
    }, 10);
  }

  ngOnDestroy() {
    this.document.body.classList.remove('guidelineModal');
  }

  getBrandGuidelines(): void {
    this.appService.getBrandGuideline(this.brandId).subscribe({
      next: data => {
        this.bgResponse = data;
        this.updateDataSet();
      }
    })
  }

  updateDataSet(): void {
    this.brandId = this.bgResponse.id;
    this.name = this.bgResponse.name;
    this.logoList = [];
    this.logoListPreview = [];
    this.savedLogo = this.bgResponse.logo;
    this.removedLogo = [];
    this.audioFileMeta = [];
    this.savedAudio = this.bgResponse.audio;
    this.signList = [];
    this.signListPreview = [];
    this.savedSign = this.bgResponse.signatureImg;
    this.removedSign = [];
    this.colorCodeList = this.bgResponse.color;
    this.productFormList = this.bgResponse.productForm ? this.bgResponse.productForm : [];
    this.textSentiment = this.bgResponse.textSentiment;
    this.voice = this.bgResponse.voice;
    let toneOfVoice = this.bgResponse.toneOfVoice.split(', ');
    this.toneOfVoice_1 = toneOfVoice[0];
    this.toneOfVoice_2 = toneOfVoice[1];
    this.toneOfVoice_3 = toneOfVoice[2];
    this.toneOfVoice_4 = toneOfVoice[3];
    this.keywordList = this.bgResponse.keywords;
    this.entity = this.bgResponse.entity && this.bgResponse.entity.length ? this.bgResponse.entity : [];
    this.subEntity = this.bgResponse.subEntity && this.bgResponse.subEntity.length ? this.bgResponse.subEntity : [];
    this.subEntityList = [];
    if(this.clientDetails.entityMap!=null){
    this.clientDetails.entityMap.forEach( (entity:any) => {
      if(this.entity.indexOf(entity.masterEntity) !== -1){
        this.subEntityList = [...this.subEntityList, ...entity.subEntity];
      }
    })
  }
    this.signatureType = this.bgResponse.signatureType;
    if( this.signatureType.toLowerCase() === 'image') {
      this.signList = [];
      this.signListPreview = [];
      this.savedSign = this.bgResponse.signatureImg;
      this.removedSign = [];
      this.signatureList = [];
    } else {
      this.signList = [];
      this.signListPreview = [];
      this.savedSign = [];
      this.removedSign = [];
      this.signatureList = this.bgResponse.signature;
    }
    this.emotionSelected = this.bgResponse.emotion.length;
    this.emotionOption.forEach( (emotion:any) => {
      if( this.bgResponse.emotion.indexOf(emotion.value) === -1) {
        emotion.checked = false;
        if(this.emotionSelected === 3) {
          emotion.disabled = true;
        }
      } else {
        emotion.checked = true;
      }
    });
    this.isLoading = false;
  }

  entityChange() : void {
    // let entityMap = this.clientDetails.entityMap.filter( (entity: any) => {
    //   return  this.entity.indexof(entity.masterEntity) !== -1;
    // });
    this.subEntityList = [];
    this.clientDetails.entityMap.forEach( (entity:any) => {
      if(this.entity.indexOf(entity.masterEntity) !== -1){
        // this.subEntityList.push(entity.subEntity);
        this.subEntityList = [...this.subEntityList, ...entity.subEntity];
      }
    });
    // this.subEntityList = entityMap.subEntity;
    this.subEntityPH = this.entity;
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  beforeUploadLogo = (file: NzUploadFile): boolean => {
    this.logoListPreview = this.logoListPreview.concat(window.URL.createObjectURL(file as any));
    this.logoList = this.logoList.concat(file);
    return false;
  }

  beforeUploadAudio = (file: NzUploadFile): boolean => {
    this.audioFileMeta = this.audioFileMeta.concat(file);
    return false;
  }

  beforeUploadSign = (file: NzUploadFile): boolean => {
    this.signListPreview = this.signListPreview.concat(window.URL.createObjectURL(file as any));
    this.signList = this.signList.concat(file);
    return false;
  }

  remove_sign(index: any) {
    this.signListPreview.splice(index, 1);
    this.signList.splice(index, 1);
  }

  remove_s_sign(index: any) {
      this.removedSign.push(this.savedSign[index]);
      this.savedSign.splice(index, 1);
  }

  remove_audio(index: any) {
    this.audioFileMeta.splice(index, 1);
  }

  remove_s_audio(index: any) {
      this.removedAudio.push(this.savedAudio[index]);
      this.savedAudio.splice(index, 1);
  }

  remove_logo(index: any) {
    this.logoListPreview.splice(index, 1);
    this.logoList.splice(index, 1);
}

  remove_s_logo(index: any) {
    this.removedLogo.push(this.savedLogo[index]);
    this.savedLogo.splice(index, 1);
  }

  addKeywordList():void {
    if( this.keyword.trim() !== '') {
      this.keywordList.push(this.keyword.toLowerCase())
      this.keyword = '';
    }
  }

  handleClose(removeKeyword: {}): void {
    this.keywordList = this.keywordList.filter((keywordData:any) => keywordData !== removeKeyword);
  }

  addTaglineList():void {
    if( this.tagline.trim() !== '') {
      this.taglineList.push(this.tagline.toLowerCase())
      this.tagline = '';
    }
  }

  handleTaglineClose(removeTagline: {}): void {
    this.taglineList = this.taglineList.filter((taglineData:any) => taglineData !== removeTagline);
  }

  addColorCodeList():void {
    if( this.colorcode.trim() !== '') {
      if( this.colorcode.indexOf('#') === -1 && this.colorcode.length === 6) {
        this.colorCodeList.push('#' + this.colorcode.toUpperCase());
        this.colorcode = '';
      } else if( this.colorcode.length === 7) {
        this.colorCodeList.push(this.colorcode.toUpperCase());
        this.colorcode = '';
      }
    }
  }

  remove_color(index: any) {
    this.colorCodeList.splice(index, 1);
  }

  log(value: object[]): void {
    console.log(value);
  }

  checkEmotion(value: object[]) {
    let emotionSelected = 0;
    value.forEach( (emotion:any) => {
      if( emotion.checked ) {
        emotionSelected++;
      }
    });
    this.emotionSelected = emotionSelected;
    if( this.emotionSelected === 3 ) {
      value.forEach( (emotion:any) => {
        if( !emotion.checked ) {
          emotion.disabled = true;
        }
      });
    } else {
      value.forEach( (emotion:any) => {
        if( emotion.disabled ) {
          emotion.disabled = false;
        }
      });
    }
  }



  addProductFormList():void {
    if( this.productForm.trim() !== '') {
      this.productFormList.push(this.productForm.toLowerCase())
      this.productForm = '';
    }
  }

  handleProductFormClose(removePF: {}): void {
    this.productFormList = this.productFormList.filter((pfData:any) => pfData !== removePF);
  }

  addSignatureList():void {
    if( this.signature.trim() !== '') {
      this.signatureList.push(this.signature.toLowerCase())
      this.signature = '';
    }  
  }

  handleSignatureClose(removeSignature: {}): void {
    this.signatureList = this.signatureList.filter((signatureData:any) => signatureData !== removeSignature);
  }

  buttonCallback = () => {
    if( this.brandId ) {
      this.update()
    } else {
      this.save();
    }
  }

  update() : void {
    this.saving = true;
    let emotionList:any = [];
    let emotionMap = this.emotionOption.forEach( (emotion:any) => {
      if( emotion.checked ) {
        emotionList.push(emotion.value);
      }
    });

    var productForm = this.productFormList.map(function(val:any) { return val.replace(',', '\\,');}).toString();

    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("id", this.brandId);
    formData.append("clientId", this.clientId);
    formData.append("productForm", productForm);
    formData.append("emotion", emotionList);
    formData.append("keywords", this.keywordList);
    formData.append("voice", this.voice);
    formData.append("textSentiment", this.textSentiment);
    formData.append("color", this.colorCodeList);
    const voiceTone = `${this.toneOfVoice_1}, ${this.toneOfVoice_2}, ${this.toneOfVoice_3}, ${this.toneOfVoice_4}`;
    formData.append("toneOfVoice", voiceTone);

    formData.append("removeLogo", this.removedLogo);
    formData.append("remainingLogo", this.savedLogo);
    formData.append("removeAudio", this.removedAudio);
    formData.append("remainingAudio", this.savedAudio);
    formData.append("removeSignature", this.removedSign);
    formData.append("remainingSignature", this.savedSign);

    this.logoList.forEach((logo:any, index:number) => {
        formData.append('logo[' + index + ']', logo);
    });
    this.audioFileMeta.forEach((audio:any, index:number) => {
        formData.append('audio[' + index + ']', audio);
    });
    formData.append('signatureType', this.signatureType);
    if( this.signatureType.toLowerCase() === 'image') {
      this.signList.forEach( (sign:any, index: number) => {
        formData.append('signatureImg[' + index + ']', sign);
      })
    }else{
      formData.append('signature', this.signatureList);
    }
    
    formData.append("entity", this.entity);
    formData.append("subEntity", this.subEntity);

    this.appService.updateBrandGuideline(formData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Information saved succesfully.',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.eventBusService.emit(new EventData('brand_guidelines_saved',''));
            this.eventBusService.emit(new EventData('close_modal',''));
            this.saving = false;
          }
        });
      },
      error: err => {
        this.detailsError = "We are facing some technical issue, please try again later.";
        this.saving = false;
      }
    });
    
  }

  save() : void {
    this.saving = true;
    let uniqueId = this.clientId + "_" + (new Date()).getTime();
    let emotionList:any = [];
    let emotionMap = this.emotionOption.forEach( (emotion:any) => {
      if( emotion.checked ) {
        emotionList.push(emotion.value);
      }
    });
    const brandDetails = this.brandService.updateBrandDetailsId(this.brandInQue.masterBrand.name, 
        this.brandInQue.productBrand ? this.brandInQue.productBrand.name : null,
        uniqueId);

    var productForm = this.productFormList.map(function(val:any) { return val.replace(',', '\\,');}).toString();
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("id", uniqueId);
    formData.append("clientId", this.clientId);
    formData.append("productForm", productForm);
    formData.append("emotion", emotionList);
    formData.append("keywords", this.keywordList);
    formData.append("voice", this.voice);
    formData.append("textSentiment", this.textSentiment);
    formData.append("color", this.colorCodeList);
    const voiceTone = `${this.toneOfVoice_1}, ${this.toneOfVoice_2}, ${this.toneOfVoice_3}, ${this.toneOfVoice_4}`;
    formData.append("toneOfVoice", voiceTone);
    this.logoList.forEach((logo:any, index:number) => {
        formData.append('logo[' + index + ']', logo);
    });
    this.audioFileMeta.forEach((audio:any, index:number) => {
        formData.append('audio[' + index + ']', audio);
    });
    formData.append('signatureType', this.signatureType);
    if( this.signatureType.toLowerCase() === 'image') {
      this.signList.forEach( (sign:any, index: number) => {
        formData.append('signatureImg[' + index + ']', sign);
      })
    }else{
      formData.append('signature', this.signatureList);
    }
    
    formData.append("entity", this.entity);
    formData.append("subEntity", this.subEntity);
    if( this.masterBrand ) {
      formData.append("master", this.masterBrand);
    }

    this.appService.addBrandGuideline(formData).subscribe({
      next: data => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Information saved succesfully.',
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            this.eventBusService.emit(new EventData('brand_guidelines_saved',''));
            this.eventBusService.emit(new EventData('close_modal',''));
            this.saving = false;
          }
        });
      },
      error: err => {
        this.detailsError = "We are facing some technical issue, please try again later.";
        this.saving = false;
      }
    });
  }

  onChangeStatus(e:Event){
    console.log('Event Details', e);
  }
}

