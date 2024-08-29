import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicModalComponentService } from 'src/app/common/services/dyamic-modal-component.service';
import { SaveFolderComponent } from '../save-folder/save-folder.component';
import { MODALCOMPONENT } from 'src/app/common/modal/modal.constants';
import { StorageService } from 'src/app/_services/storage.service';
import { AppServices } from 'src/app/_services/app.service';
import { Range } from 'src/app/common/models/range.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventBusService } from 'src/app/_shared/event-bus.service';
import { EventData } from 'src/app/_shared/event.class';

interface ItemData {
  id: string;
  brand: string;
}

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ComparisonComponent {
  user: any = {};
  productBrand: any = [];
  compareId: string = '';
  listOfData: any = [];
  selection: any = [];
  adsByBrand: any = {};
  brandArray: any = [];
  compareName: string = '';
  compareObj: any = [];
  compareType: string = "";
  selectedIndex: number = 0;
  clExpand: boolean = false;
  acExpand: boolean = false;
  bcExpand: boolean = false;
  dcExpand: boolean = false;
  eiExpand: boolean = false;
  showOptimizedForSound: boolean = true;
  Range: any;
  adList: any = [];
  inputObj: any = {};
  adSetInput = new Set<ItemData>();
  response: any = {};
  breadcrumb: any = [
    {
      name: "A/B Testing",
      link: "/compare/creative"
    }
  ];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dynamicModalService: DynamicModalComponentService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private service: AppServices,
    private modal: NzModalService,
    private eventBusService: EventBusService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.eventBusService.emit(new EventData('startFull', ''));
      this.Range = Range;
      this.user = this.storage.getUser();
      if (this.user) {
        this.productBrand = this.user.brands;
      }
      this.compareId = this.route.snapshot.params["compareId"] ? this.route.snapshot.params["compareId"] : 'create';
      this.selection = localStorage.getItem("compareIds");
      if (this.selection) {
        this.selection = JSON.parse(this.selection);
        if (this.selection.title) {
          this.breadcrumb.push({
            name: this.capitalizeFirstLetter(this.selection.title),
            link: null
          });
        } else {
          this.breadcrumb.push({
            name: "Create",
            link: null
          });
        }
        this.compareType = this.selection.type;
      } else {
        //this.router.navigate(["compare","creative"]);
      }
      this.getAdsByBrand();
    }, 0);
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getAdsByBrand() {
    this.service.getArtifactByBrand().subscribe({
      next: (data: any) => {
        this.adsByBrand = data;
        if (this.selection) {

          this.brandArray = this.selection.adSet.map((item: any) => { return item.brand });
          this.compareName = this.selection.title;
          this.compareObj = [];
          this.selection.adSet.forEach((item: any) => {
            this.selectedIndex = 0;
            this.getAdDetails(item.id);
          });
        }
      }
    });
  }

  getAdDetails(id: string) {
    this.service.getAdCompareReport(id, this.selection.type).subscribe({
      next: (data: any) => {
        if (data) {
          let reportData = data;
          this.compareObj[this.selectedIndex] = reportData;
          if (this.compareObj[this.selectedIndex].optimizedForSound == null) {
            this.showOptimizedForSound = false;
          }
          if (this.selection) {
            this.selectedIndex++;
          }
          if (this.selectedIndex >= this.selection.adSet.length) {
            this.eventBusService.emit(new EventData('loader', 'stopFull'));
          }
          this.closeSelectAd();
        }
      }
    });
  }

  openSaveFolderModal() {
    this.dynamicModalService.createComponentModal('', SaveFolderComponent, this.viewContainerRef);
    this.dynamicModalService.updateModalCotentComponent(MODALCOMPONENT.SAVE_FOLDER);
  }

  closeSelectAd() {
    const modalOverlay = document.getElementById('overlayModal') as HTMLElement;
    const modalAdSelector = document.getElementById('adPickerModal') as HTMLElement;
    modalOverlay.style.display = "none";
    modalAdSelector.style.display = 'none';
  }

  addNewComp() {
    if (this.compareObj[this.compareObj.length - 1]) {
      this.compareObj.push(null);
      this.brandArray.push(null);
    }
  }

  selectAd(index: number) {
    if (!this.brandArray[index]) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please select brand to proceed.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => { }
      });
      return;
    } else {
      this.selectedIndex = index;
      const modalOverlay = document.getElementById('overlayModal') as HTMLElement;
      const modalAdSelector = document.getElementById('adPickerModal') as HTMLElement;
      modalOverlay.style.display = "block";
      modalAdSelector.style.display = 'block';
      this.adList = this.adsByBrand.filter((item: any) => {
        return item.metadata.artifactType === this.compareType && item.metadata.brand === this.brandArray[index];
      });
    }
  }

  removeAd(index: number) {
    this.brandArray.splice(index, 1);
    this.compareObj.splice(index, 1);
    if (this.compareObj.length < 3) {
      this.compareObj.push(null);
    }
    if (this.brandArray.length < 3) {
      this.brandArray.push(null);
    }
  }

  selectBrand(event: any, index: number) {

    let brandAds = this.adsByBrand.filter((item: any) => {
      return item.metadata.brand === event;
    });

    if (brandAds.length) {

      if (this.brandArray[index] !== event) {
        this.compareObj[index] = null;
      }
      this.brandArray[index] = event;
    } else {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please select other brand as there is no ad available.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => { }
      });
      return;
    }
  }

  toggleAdSelection(evt: any, ad: any) {
    let isAlreadySelected = this.compareObj.filter(function (item: any) {
      return item && item.artifactId == ad.metadata.id;
    });

    evt.target.checked = false;

    if (isAlreadySelected.length) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "This ad is already part of the compare list",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => { }
      });
    } else {
      this.getAdDetails(ad.metadata.id);
    }
  }

  checkCompareName() {
    if (this.selection && this.selection.title && this.selection.title.toLowerCase() === this.compareName.toLowerCase()) {
      this.save();
    } else {
      let pattern = /^[a-zA-Z0-9]+(?:[\w -]*[a-zA-Z0-9]+)*$/;
      if (this.compareName.match(pattern)) {
        this.service.checkName(this.compareName).subscribe({
          next: (data: any) => {
            this.save();
            return;
          },
          error: err => {
            if (err && err.error && err.error.errorCode === 'Name_Exist') {
              this.modal.error({
                nzTitle: "Error",
                nzContent: "The name entered is already been used please use other name",
                nzClassName: "small-modal",
                nzClosable: false,
                nzMaskClosable: false,
                nzKeyboard: false,
                nzOnOk: () => { }
              });
            } else {
              this.modal.error({
                nzTitle: "Error",
                nzContent: "We are facing some technical issue pleae try again later",
                nzClassName: "small-modal",
                nzClosable: false,
                nzMaskClosable: false,
                nzKeyboard: false,
                nzOnOk: () => { }
              });
            }
          }
        });
      } else {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "Uh! Oh! Ad compare name cannot contain special characters.",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => { }
        });
        return;
      }
    }
  }

  save() {
    let inputObj = this.inputObj;
    const modalOverlay = document.getElementById('overlayModal') as HTMLElement;
    const modalcompareName = document.getElementById('compareNameModal') as HTMLElement;
    modalOverlay.style.display = "none";
    modalcompareName.style.display = 'none';

    if (this.compareId) {
      inputObj["id"] = this.compareId === 'create' ? "" : this.compareId;
    }
    if (this.compareName) {
      inputObj["title"] = this.compareName;
    }
    this.service.createCompare(inputObj).subscribe({
      next: (data: any) => {
        this.selection = data;
        if (this.selection.id) {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: "Ad compare report successfully saved.",
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => {
              this.router.navigate(["compare", "creative"]);
            }
          });
        } else {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "We are facing some technical issue pleae try again later",
            nzClassName: "small-modal",
            nzClosable: false,
            nzMaskClosable: false,
            nzKeyboard: false,
            nzOnOk: () => { }
          });
        }
      },
      error: err => {
        this.modal.error({
          nzTitle: "Error",
          nzContent: "We are facing some technical issue pleae try again later",
          nzClassName: "small-modal",
          nzClosable: false,
          nzMaskClosable: false,
          nzKeyboard: false,
          nzOnOk: () => { }
        });
      }
    });
  }

  saveCompare() {
    let nonNullElement = 0;
    let totalObj = this.compareObj.length;

    for (var i = 0; i < totalObj; i++) {
      nonNullElement += (this.compareObj[i]) ? 1 : 0;
    }

    if (nonNullElement < 2) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "Please select atleast 2 ads to save the compare.",
        nzClassName: "small-modal",
        nzClosable: false,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOnOk: () => { }
      });
      return;
    } else {
      this.adSetInput.clear();
      this.compareObj.forEach((compareO: any, index: number) => {
        if (compareO) {
          this.adSetInput.add({ 'brand': this.brandArray[index], 'id': compareO.artifactId });
        }
      });

      let inputObj = {
        'adIds': Array.from(this.adSetInput),
        'compareType': this.selection.type
      }

      this.inputObj = inputObj;
      this.openNameModal();
    }
  }

  openNameModal() {
    const modalOverlay = document.getElementById('overlayModal') as HTMLElement;
    const modalcompareName = document.getElementById('compareNameModal') as HTMLElement;
    modalOverlay.style.display = "block";
    modalcompareName.style.display = 'block';
  }

  closeCompareName() {
    const modalOverlay = document.getElementById('overlayModal') as HTMLElement;
    const modalcompareName = document.getElementById('compareNameModal') as HTMLElement;
    modalOverlay.style.display = "none";
    modalcompareName.style.display = 'none';
  }

}
