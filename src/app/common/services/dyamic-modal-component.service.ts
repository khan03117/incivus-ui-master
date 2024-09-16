import { Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserManagementModalComponent } from '../modal/user-management-modal/user-management-modal.component';
import { IModalData } from '../models/brandSetup/brandSetup.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AlertModalComponent } from '../modal/alert-modal/alert-modal.component';

@Injectable({
  providedIn: "root"
})
export class DynamicModalComponentService {

  brandDetails: any = null;
  completeBD: any = null;
  clientId: string = '';
  clientDetails: any = null;
  brandGuideline: any = {};
  userIds: any = null;
  sharableUserList: any = [];
  campaignName: string = '';
  creativeMeta: any = {};
  campaign: any = {};
  private updateModalContent$ = new BehaviorSubject<any>({});
  updateModalContentInfo$ = this.updateModalContent$.asObservable();

  constructor(
    private modal: NzModalService,
    private guidelineModalRef: NzModalRef,
    // public viewContainerRef: ViewContainerRef
  ) { }

  showAlertModal({ title, description, componentRef }: any) {
    this.createComponentModal(title, AlertModalComponent, componentRef);
  }

  closeModal() {
    this.guidelineModalRef.destroy();
  }

  createComponentModal(title: string, component?: any, viewModelRef?: any, data?: any, modalClassName?: string): void {
    console.log('modalClassName', modalClassName)
    this.guidelineModalRef = this.modal.create<UserManagementModalComponent, IModalData>({
      nzTitle: title,
      nzClassName: modalClassName ? modalClassName : '',
      nzContent: UserManagementModalComponent,
      nzViewContainerRef: viewModelRef,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzData: {
        title,
        displayComponent: component,
        data
      },
      nzFooter: null
    });
    const instance = this.guidelineModalRef.getContentComponent();
    this.guidelineModalRef.afterOpen.subscribe(() => {
      this.updateModalCotentComponent();
    });
    // Return a result when closed
    this.guidelineModalRef.afterClose.subscribe(result => {
      // Close after changes
    });
  }

  updateModalCotentComponent(action: string = '') {
    console.log('hi');
    this.updateModalContent$.next(action);
  }

  public setBrandDetails(bd: any): void {
    this.brandDetails = bd;
  }

  public getBrandDetails(): any {
    return this.brandDetails;
  }

  public setCompleteBD(bd: any): void {
    this.completeBD = bd;
  }

  public getCompleteBD(): any {
    return this.completeBD;
  }

  updateCompleteBrand(brandDetails: any): void {
    let newBD = this.completeBD.filter((bd: any) => {
      return bd.masterBrand.name !== brandDetails.masterBrand.name
    });
    newBD.push(brandDetails);
    this.completeBD = newBD;
  }

  updateBrandDetailsId(master: string, product: string, id: string): any {
    this.completeBD.forEach((element: any) => {
      if (!product) {
        if (element.masterBrand.name === master) {
          element.masterBrand.id = 'id';
        }
      } else {
        if (element.masterBrand.name === master) {
          element.productBrand.forEach((pb: any) => {
            if (pb.name === product) {
              pb.id = id;
            }
          })
        }
      }
    });

    return this.completeBD;
  }

  setClientId(clientId: string): void {
    this.clientId = clientId;
  }

  getClientId(): string {
    return this.clientId;
  }

  setBrandGuideline(bg: any): void {
    this.brandGuideline = bg;
  }

  getBrandGuideline(): any {
    return this.brandGuideline;
  }

  setClientDetails(data: any) {
    this.clientDetails = data;
  }

  getClientDetails(): void {
    return this.clientDetails;
  }

  setUserIds(userIds: any): void {
    this.userIds = userIds;
  }

  getUserIds(): any {
    return this.userIds;
  }

  setSharableUserList(list: any): void {
    this.sharableUserList = list;
  }

  getSharableUserList(): any {
    return this.sharableUserList;
  }

  setCampaignName(campaignName: string): void {
    this.campaignName = campaignName;
  }

  getCampaignName(): string {
    return this.campaignName;
  }

  setCreativeMeta(creativeMeta: any): void {
    this.creativeMeta = creativeMeta;
  }

  getCreativeMeta(): any {
    return this.creativeMeta;
  }

  setCampaign(campaign: any) {
    this.campaign = campaign;
  }

  getCampaign(): any {
    return this.campaign;
  }

  clearEverything(): void {
    this.brandDetails = null;
    this.completeBD = null;
    this.clientId = '';
    this.clientDetails = null;
    this.brandGuideline = {};
    this.userIds = null;
    this.sharableUserList = [];
    this.campaignName = '';
    this.creativeMeta = {};
    this.campaign = {};
  }

}