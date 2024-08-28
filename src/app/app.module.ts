import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment.prod';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { HomeComponent } from './home/home.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { NavComponent } from './common/nav/nav.component';
import { HeaderComponent } from './common/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './common/content/content.component';
import { NgZorroAntdModule } from './ant.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { CompanySetupComponent } from './components/company-brand-setup/company-setup/company-setup.component';
import { BreadcrumbComponent } from './common/breadcrumb/breadcrumb.component';
import { AlertComponent } from './common/alert/alert.component';
import { ButtonComponent } from './common/button/button.component';
import { AccordionComponent } from './common/accordion/accordion.component';
import { DynamicTemplateDirective } from './directive/dynamic-template.directive';
import { CompanyBrandSetupContainerComponent } from './components/company-brand-setup/company-brand-setup-container/company-brand-setup-container.component';
import { BrandSetupComponent } from './components/company-brand-setup/brand-setup/brand-setup.component';
import { BrandSetupActionComponent } from './components/company-brand-setup/brand-setup-action/brand-setup-action.component';
import { AddBrandProductsComponent } from './components/company-brand-setup/add-brand-products/add-brand-products.component';
import { BrandListComponent } from './components/company-brand-setup/brand-list/brand-list.component';
import { AddBrandGuidelinesComponent } from './components/company-brand-setup/add-brand-guidelines/add-brand-guidelines.component';

import { ClientListComponent } from './admin/super/clientList/clientList.component';
import { ClientSetupComponent } from './admin/super/clientSetup/clientSetup.component';
import { ClientCreateComponent } from './admin/super/clientSetup/clientCreate/clientCreate.component';
import { UserCreateComponent } from './admin/super/clientSetup/userCreate/userCreate.component';
import { UserListComponent } from './admin/super/clientSetup/userList/userList.component';
import { UserListComponent as userListManagementComponent } from './admin/super/userAccessManagement/user-list/user-list.component';
import { UserCreateComponent as UserCreateManagementComponent } from './admin/super/userAccessManagement/user-create/user-create.component';
import { DynamicModalComponentService } from './common/services/dyamic-modal-component.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BrandSetupModalComponent } from './common/modal/brand-setup-modal/brand-setup-modal.component';
import { EditBrandDetailsComponent } from './components/company-brand-setup/edit-brand-details/edit-brand-details.component';
import { RoleListComponent } from './admin/super/role-management/role-list/role-list.component';
import { PermissionsListComponent } from './admin/super/permission-management/permissions-list/permissions-list.component';
import { MessageService } from './_services/message.service';

import { FilterPipe } from './filter.pipe';
import { CreateRoleComponent } from './admin/super/role-management/create-role/create-role.component';
import { CreatePermissionComponent } from './admin/super/permission-management/create-permission/create-permission.component';
import { AssignPermissionsComponent } from './admin/super/permission-management/assign-permissions/assign-permissions.component';
import { BadgeComponent } from './common/badge/badge.component';
import { ActivateUserComponent } from './admin/super/userAccessManagement/activate-user/activate-user.component';
import { AssignBrandComponent } from './admin/super/userAccessManagement/assign-brand/assign-brand.component';
import { UserManagementModalComponent } from './common/modal/user-management-modal/user-management-modal.component';
import { CreativeContainerComponent } from './components/manage-ads-creatives/creative-container/creative-container.component';
import { CreativeListComponent } from './components/manage-ads-creatives/creative-list/creative-list.component';
import { AllReportsComponent } from './components/manage-ads-creatives/all-reports/all-reports.component';
import { UploadCreativesComponent } from './components/manage-ads-creatives/upload-creatives/upload-creatives.component';
import { CreateCampaignComponent } from './components/manage-ads-creatives/create-campaign/create-campaign.component';
import { CreateCampaignSuccessComponent } from './components/manage-ads-creatives/create-campaign-success/create-campaign-success.component';
import { AlertModalComponent } from './common/modal/alert-modal/alert-modal.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ShareCampaignComponent } from './components/manage-ads-creatives/share-campaign/share-campaign.component';
import { CampaignDetailsComponent } from './components/manage-ads-creatives/campaign-details/campaign-details.component';
import { UploadComponent } from './common/upload/upload.component';
import { UploadCreativeModalComponent } from './components/manage-ads-creatives/upload-creative-modal/upload-creative-modal.component';
import { CreativeDetailsComponent } from './components/manage-ads-creatives/creative-details/creative-details.component';
import { ReportContainerComponent } from './components/reports/report-container/report-container.component';
import { ReportCardComponent } from './components/reports/report-card/report-card.component';
import { RecallContainerComponent } from './components/reports/recall/recall-container/recall-container.component';
import { RecallCardComponent } from './components/reports/recall/recall-card/recall-card.component';
import { AttentionCardComponent } from './components/reports/recall/attention-card/attention-card.component';
import { CognitiveLoadComponent } from './components/reports/cognitive-load/cognitive-load.component';
import { EffectivenessContainerComponent } from './components/reports/effectiveness/effectiveness-container/effectiveness-container.component';
import { TextReadabilityCardComponent } from './components/reports/effectiveness/text-readability-card/text-readability-card.component';
import { PersuasivenessCardComponent } from './components/reports/effectiveness/persuasiveness-card/persuasiveness-card.component';
import { AdCopyAttentionCardComponent } from './components/reports/effectiveness/ad-copy-attention-card/ad-copy-attention-card.component';
import { EmotionsComponent } from './components/reports/emotions/emotions.component';
import { BrandRecognitionComponent } from './components/reports/brands/brand-recognition/brand-recognition.component';
import { DigitalAccessibilityComponent } from './components/reports/digital-accessibility/digital-accessibility.component';
import { BrandComplianceComponent } from './components/reports/brands/brand-compliance/brand-compliance.component';
import { BrandsContainerComponent } from './components/reports/brands/brands-container/brands-container.component';
import { ColorContrastComponent } from './components/reports/digital-accessibility/color-contrast/color-contrast.component';
import { EmotionalIntensityComponent } from './components/reports/emotional-intensity/emotional-intensity.component';
import { ApxChartComponent } from './common/apxChart/apxChart.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { HelpContainerComponent } from './components/help/help-container/help-container.component';
import { HelpCardComponent } from './components/help/help-card/help-card.component';
import { GetStartedComponent } from './components/help/get-started/get-started.component';
import { AccountComponent } from './components/help/account/account.component';
import { SupportComponent } from './components/help/support/support.component';
import { CreativeComponent } from './components/help/creative/creative.component';
import { MusicComponent } from './components/reports/music/music.component';
import { MusicProgressComponent } from './components/reports/music/musicProgress/musicProgress.component';
import { ColorComponent } from './components/reports/emotional-intensity/color/color.component';
import { CreativeContainerComponent as AbTestCreativeContainerComponent } from './components/ab-testing/creative-container/creative-container.component';
import { CreativeListComponent as AbTestCreativeListComponent } from './components/ab-testing/creative-list/creative-list.component';
import { FolderViewComponent } from './components/ab-testing/folder-view/folder-view.component';
import { ComparisonComponent } from './components/ab-testing/comparison/comparison.component';
import { CreateFolderComponent } from './components/ab-testing/create-folder/create-folder.component';
import { SaveFolderComponent } from './components/ab-testing/save-folder/save-folder.component';
import { HighlightDirective } from './common/directive/highlight';
import {DisclaimerComponent} from './components/manage-ads-creatives/disclaimer/disclaimer.component';
import { ServiceRequestsComponent } from "./components/service-requests/service-requests.component";
import { AddServiceRequestComponent } from "./components/service-requests/add-service-request/add-service-request.component";
import { ServiceUserListComponent } from "./admin/super/clientSetup/service-user-list/service-user-list.component";
import { ServiceUserComponent } from "./admin/super/clientSetup/service-user/service-user.component";
import { ViewServiceRequestComponent } from "./components/service-requests/view-service-request/view-service-request.component";
import { CapitalizePipe } from "./common/pipes/capitalize.pipe";
import { CommonModule } from "@angular/common";
import { CounterPipe } from "./common/pipes/counter.pipe";
import { FeatureAccessComponent } from './admin/super/clientSetup/feature-access/feature-access.component';
import {
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { CampaignDetails2Component } from "./components/manage-ads-creatives/campaign-details-2/campaign-details-2.component";
import { CampaignListComponent } from "./components/manage-ads-creatives/campaign-list/campaign-list.component";
import { AddMediaAccountComponent } from "./components/media-channels/add-media-account/add-media-account.component";
import { MediaAccountListComponent } from "./components/media-channels/media-list-channels/media-list.component";
import { RulesComponent } from './customrules/rules.component';
import { RuleCreateComponent } from './customrulecreate/rule-create.component';
import { ShowRuleComponent } from './show-rule/show-rule.component';
import { RuleMatrixShowComponent } from './customrulecreate/rule-matrix-show/rule-matrix-show.component';
const fbOptions = {
  config_id: "486243237425446",
  configId: "486243237425446",
  // config_id: "1073130757082646",
  // configId: "1073130757082646",
};

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPwdComponent,
    ResetPwdComponent,
    HomeComponent,
    NavComponent,
    HeaderComponent,
    DashboardComponent,
    ContentComponent,
    CompanySetupComponent,
    BreadcrumbComponent,
    AlertComponent,
    ButtonComponent,
    AccordionComponent,
    CompanyBrandSetupContainerComponent,
    BrandSetupComponent,
    BrandSetupActionComponent,
    AddBrandProductsComponent,
    BrandListComponent,
    AddBrandGuidelinesComponent,
    BrandSetupModalComponent,
    EditBrandDetailsComponent,
    RoleListComponent,
    CreateRoleComponent,
    PermissionsListComponent,
    CreatePermissionComponent,
    AssignPermissionsComponent,
    DynamicTemplateDirective,
    ClientListComponent,
    ClientSetupComponent,
    ClientCreateComponent,
    UserCreateComponent,
    UserListComponent,
    userListManagementComponent,
    UserCreateManagementComponent,
    UserManagementModalComponent,
    AssignBrandComponent,
    ActivateUserComponent,
    CreativeContainerComponent,
    CreativeListComponent,
    AllReportsComponent,
    UploadCreativesComponent,
    CreateCampaignComponent,
    CreateCampaignSuccessComponent,
    AlertModalComponent,
    BadgeComponent,
    ShareCampaignComponent,
    CampaignDetailsComponent,
    UploadComponent,
    UploadCreativeModalComponent,
    CreativeDetailsComponent,
    ReportContainerComponent,
    ReportCardComponent,
    RecallContainerComponent,
    RecallCardComponent,
    AttentionCardComponent,
    CognitiveLoadComponent,
    EffectivenessContainerComponent,
    PersuasivenessCardComponent,
    TextReadabilityCardComponent,
    AdCopyAttentionCardComponent,
    EmotionsComponent,
    BrandComplianceComponent,
    BrandsContainerComponent,
    BrandRecognitionComponent,
    DigitalAccessibilityComponent,
    ColorContrastComponent,
    EmotionalIntensityComponent,
    MusicComponent,
    ColorComponent,
    MusicProgressComponent,
    HelpContainerComponent,
    HelpCardComponent,
    GetStartedComponent,
    SupportComponent,
    AccountComponent,
    CreativeComponent,
    ApxChartComponent,
    AbTestCreativeContainerComponent,
    AbTestCreativeListComponent,
    FolderViewComponent,
    ComparisonComponent,
    CreateFolderComponent,
    SaveFolderComponent,
    HighlightDirective,
    FilterPipe,
    CapitalizePipe,
    CounterPipe,
    MediaAccountListComponent,
    AddMediaAccountComponent,
    CampaignListComponent,
    ServiceRequestsComponent,
    AddServiceRequestComponent,
    CampaignDetails2Component,
    DisclaimerComponent,
    ServiceRequestsComponent,
    AddServiceRequestComponent,
    ServiceUserListComponent,
    ServiceUserComponent,
    ViewServiceRequestComponent,
    FeatureAccessComponent,
    RulesComponent,
    RuleCreateComponent,
    ShowRuleComponent,
    RuleMatrixShowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CarouselModule,
    NgxSliderModule,
    NgApexchartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    // SocialLoginModule,
    CommonModule,
  ],
  providers: [
    httpInterceptorProviders,
    DynamicModalComponentService,
    MessageService,
    {
      provide: NzModalRef,
      useValue: {},
    },
    {
      provide: NZ_ICONS,
      useValue: icons,
    },
    provideNzI18n(en_US),
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          // {
          //   id: GoogleLoginProvider.PROVIDER_ID,
          //   provider: new GoogleLoginProvider(
          //     'clientId'
          //   )
          // },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("428832643193545", fbOptions),
            // provider: new FacebookLoginProvider("717630503787218", fbOptions),
          },
        ],
        onError: (err: any) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
