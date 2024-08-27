import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BrandDetails } from 'src/app/common/models/brandSetup/brandSetup.model';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BrandListComponent {
  @Input() public brandDetailsList: BrandDetails | null | undefined;
  @Input() public tagLength?: number;
  @Input() public myCallback: Function; 

  constructor() {
    this.brandDetailsList = {
      masterBrand : {
        name: '',
        id: ''
      },
      productBrand:[]
    };
    this.tagLength = 7,
    this.myCallback = () => {};
  }

  ngOnInit(){
    console.log('brandDetailsList', this.brandDetailsList);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > this.tagLength!;
    return isLongTag ? `${tag.slice(0, this.tagLength)}...` : tag;
  }
}
