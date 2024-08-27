import { Component, ComponentFactoryResolver, ViewChild, inject } from '@angular/core';
import { IModalData } from '../../models/brandSetup/brandSetup.model';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { DynamicTemplateDirective } from 'src/app/directive/dynamic-template.directive';
import { DynamicModalComponentService } from '../../services/dyamic-modal-component.service';
import { CreateCampaignComponent } from 'src/app/components/manage-ads-creatives/create-campaign/create-campaign.component';
import { MODALCOMPONENT } from '../modal.constants';
import { CreateCampaignSuccessComponent } from 'src/app/components/manage-ads-creatives/create-campaign-success/create-campaign-success.component';
import { CreateFolderComponent } from 'src/app/components/ab-testing/create-folder/create-folder.component';
import { SaveFolderComponent } from 'src/app/components/ab-testing/save-folder/save-folder.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-management-modal',
  templateUrl: './user-management-modal.component.html',
  styleUrls: ['./user-management-modal.component.less']
})
export class UserManagementModalComponent {
  readonly #modal = inject(NzModalRef);
  nzModalData: IModalData = inject(NZ_MODAL_DATA);
  private ngUnsubscribe = new Subject<void>();
  @ViewChild(DynamicTemplateDirective, { static: true }) dynamicTemplate!: DynamicTemplateDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private dynamicModalService:DynamicModalComponentService){}

  ngOnInit(){
    setTimeout( () => {
      this.renderDynamicComponent();
      this.dynamicModalService.updateModalContentInfo$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((name:any) => {
        this.updateBrandSetupModalContent(name);
      });
    }, 10);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  renderDynamicComponent(inputData?:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.nzModalData.displayComponent);
    const viewContainerRef = this.dynamicTemplate.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    let componentRefInstance: any = componentRef.instance;
    componentRefInstance.data = this.nzModalData.data;
  }

  destroyModal(): void {
    console.log('nzModalData', this.nzModalData)
    this.#modal.componentInstance.destroy({ data: 'this the result data' });
  }

  updateBrandSetupModalContent(name:string) {
    switch(name){
      case MODALCOMPONENT.CREATE_FOLDER:
        this.nzModalData = {
          title:"Select a folder",
          displayComponent:CreateFolderComponent,
          data:{
            type:MODALCOMPONENT.CREATE_FOLDER
          }
        }
        break;
      case MODALCOMPONENT.SAVE_FOLDER:
        this.nzModalData = {
          title:"Folder",
          displayComponent:SaveFolderComponent,
          data:{
            type:MODALCOMPONENT.SAVE_FOLDER
          }
        }
        break;
      case MODALCOMPONENT.LINK_CAMPAIGN:
        this.nzModalData = {
          title:"Link to campaign",
          displayComponent:CreateCampaignComponent,
          data:{
            type:MODALCOMPONENT.LINK_CAMPAIGN
          }
        }
        break;
      case MODALCOMPONENT.CREATE_CAMPAIGN:
      case MODALCOMPONENT.EDIT_CAMPAIGN:
        this.nzModalData = {
          title: name === MODALCOMPONENT.CREATE_CAMPAIGN ? "Create campaign" : "Edit campaign name",
          displayComponent:CreateCampaignComponent,
          data:{
            type:name
          }
        }
        break;
      case MODALCOMPONENT.CREATE_CAMPAIGN_SUCCESS:
        this.#modal.updateConfig({
          nzClassName:"successModal"
        });
        this.nzModalData = {
          displayComponent:CreateCampaignSuccessComponent
        }
        break;
      default:
        console.log('open modal')
        break;
    }
    this.renderDynamicComponent();
  }
}
