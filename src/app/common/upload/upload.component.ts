import { Component, ViewEncapsulation, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent {
  @Input() public myCallback: Function;
  @Input() public fileAccept: string;
  @Input() public fileType: string;
  errorMsg: string = '';
  logoListPreview: any;
  file: any;
  type: string = '';
  uploadInfo :any = { 
    showPreviewIcon: false, 
    showRemoveIcon:false, 
    showDownloadIcon: false
  }

  constructor(private sanitizer: DomSanitizer){
    this.myCallback = () => {};
    this.fileAccept = '';
    this.fileType = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logoListPreview = null;
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  beforeUploadLogo = (file: NzUploadFile): boolean => {
    let acceptedFileType = this.fileAccept.split(',');
    this.file = file;
    let name = this.file.name;
    let nameArr = name.split('.');
    const last = nameArr[nameArr.length - 1];
    if( !(acceptedFileType.includes("." + last))) {
      this.errorMsg = "File format not supported";
      return false;
    }
    this.logoListPreview = null;
    this.logoListPreview = window.URL.createObjectURL(file as any);
    if( this.fileType && this.fileType === 'video') {
      let element = document.getElementById("source_video");
      let parentElement = element?.parentElement as HTMLVideoElement;
      parentElement?.load();
    } else if( this.fileType === 'any') {
      let videoFormat = ['mp4', 'avi', 'wmv', 'ogg', 'webm', 'mov'];
      if( videoFormat.includes(last)) {
        this.type = 'video';
        let element = document.getElementById("source_video");
        let parentElement = element?.parentElement as HTMLVideoElement;
        parentElement?.load();
      } else {
        this.type = 'image';
      }
    }
    this.myCallback(this.file);
    return false;
  }

}
