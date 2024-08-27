import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { CompanyBrandSetupContainerComponent } from './components/company-brand-setup/company-brand-setup-container/company-brand-setup-container.component';

import { ClientListComponent } from './admin/super/clientList/clientList.component';
import { ClientSetupComponent } from './admin/super/clientSetup/clientSetup.component';
import { RoleListComponent } from './admin/super/role-management/role-list/role-list.component';
import { PermissionsListComponent } from './admin/super/permission-management/permissions-list/permissions-list.component';
import { CreateRoleComponent } from './admin/super/role-management/create-role/create-role.component';
import { CreatePermissionComponent } from './admin/super/permission-management/create-permission/create-permission.component';
import { UserListComponent as userListManagementComponent } from './admin/super/userAccessManagement/user-list/user-list.component';
import { UserCreateComponent as UserCreateManagementComponent } from './admin/super/userAccessManagement/user-create/user-create.component';
import { CreativeListComponent } from './components/manage-ads-creatives/creative-list/creative-list.component';
import { CreativeContainerComponent } from './components/manage-ads-creatives/creative-container/creative-container.component';
import { AllReportsComponent } from './components/manage-ads-creatives/all-reports/all-reports.component';
import { ReportContainerComponent } from './components/reports/report-container/report-container.component';
import { UploadCreativesComponent } from './components/manage-ads-creatives/upload-creatives/upload-creatives.component';
import { CampaignDetailsComponent } from './components/manage-ads-creatives/campaign-details/campaign-details.component';
import { CreativeDetailsComponent } from './components/manage-ads-creatives/creative-details/creative-details.component';
import { HeaderComponent } from './common/header/header.component';
import { HelpContainerComponent } from './components/help/help-container/help-container.component';
import { HelpCardComponent } from './components/help/help-card/help-card.component';
import { GetStartedComponent } from './components/help/get-started/get-started.component';
import { AccountComponent } from './components/help/account/account.component';
import { CreativeComponent } from './components/help/creative/creative.component';
import { SupportComponent } from './components/help/support/support.component';
import { CreativeContainerComponent as AbTestCreativeContainerComponent } from './components/ab-testing/creative-container/creative-container.component';
import { CreativeListComponent as AbTestCreativeListComponent } from './components/ab-testing/creative-list/creative-list.component';
import { FolderViewComponent } from './components/ab-testing/folder-view/folder-view.component';
import { ComparisonComponent } from './components/ab-testing/comparison/comparison.component';
import { AddServiceRequestComponent } from "./components/service-requests/add-service-request/add-service-request.component";
import { ServiceRequestsComponent } from "./components/service-requests/service-requests.component";
import { ViewServiceRequestComponent } from "./components/service-requests/view-service-request/view-service-request.component";
import { CampaignDetails2Component } from "./components/manage-ads-creatives/campaign-details-2/campaign-details-2.component";
import { CampaignListComponent } from "./components/manage-ads-creatives/campaign-list/campaign-list.component";
import { AddMediaAccountComponent } from "./components/media-channels/add-media-account/add-media-account.component";
import { MediaAccountListComponent } from "./components/media-channels/media-list-channels/media-list.component";
import { RulesComponent } from './customrules/rules.component';
import { RuleCreateComponent } from './customrulecreate/rule-create.component';

const routes: Routes = [
  {
    path: "compare",
    component: DashboardComponent,
    children: [
      {
        path: "creative",
        component: AbTestCreativeContainerComponent,
        // children: [{
        //   path: 'list', component: AbTestCreativeListComponent,
        // }]
      },
      {
        path: "report/:compareId",
        component: ComparisonComponent,
      },
    ],
  },
  {
    path: "reports",
    component: DashboardComponent,
    children: [
      {
        path: ":reportType/list",
        component: AllReportsComponent,
      },
      {
        path: ":artifactId",
        component: ReportContainerComponent,
      },
    ],
  },
  {
    path: "campaign",
    component: DashboardComponent,
    children: [
      {
        path: ":brand/:campaignName",
        component: CampaignDetailsComponent,
      },
    ],
  },
  {
    path: "help",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: HelpContainerComponent,
        children: [
          {
            path: "",
            component: HelpCardComponent,
          },
          {
            path: "get-started",
            component: GetStartedComponent,
          },
          {
            path: "account",
            component: AccountComponent,
          },
          {
            path: "support",
            component: SupportComponent,
          },
          {
            path: "creative",
            component: CreativeComponent,
          },
        ],
      },
    ],
  },
  {
    path: "creatives",
    component: DashboardComponent,
    children: [
      {
        path: "list/:flightType", // For Incivus Admin only
        component: CreativeContainerComponent,
      },
      {
        path: "pre-flight/list",
        component: CreativeContainerComponent,
      },
      {
        path: "create",
        component: UploadCreativesComponent,
      },
      {
        path: ":artifactId",
        component: CreativeDetailsComponent,
      },
      {
        path: ":flightType/list",
        component: CampaignListComponent,
      },
    ],
  },

  {
    path: "client",
    component: DashboardComponent,
    children: [
      {
        path: "list",
        component: ClientListComponent,
      },
      {
        path: "media-accounts",
        component: MediaAccountListComponent,
      },
      {
        path: "add-media-account",
        component: AddMediaAccountComponent,
      },
      {
        path: "manage/:clientId",
        component: ClientSetupComponent,
      },
      {
        path: "company",
        component: CompanyBrandSetupContainerComponent,
      },
      {
        path: "permission/:permissionId",
        component: CreatePermissionComponent,
      },
      {
        path: "permission",
        component: PermissionsListComponent,
      },
      {
        path: "role",
        component: RoleListComponent,
      },
      {
        path: "role/:roleId",
        component: CreateRoleComponent,
      },
      {
        path: "user",
        component: userListManagementComponent,
      },
      {
        path: "user/:userId",
        component: UserCreateManagementComponent,
      },
      {
        path: "service-requests/create",
        component: AddServiceRequestComponent,
      },
      {
        path: "service-requests/:type",
        component: ServiceRequestsComponent,
      },
      {
        path: "service-requests/:id/edit",
        component: AddServiceRequestComponent,
      },
      {
        path: "service-requests/:id/view",
        component: ViewServiceRequestComponent,
      },
    ],
  },
  {
    path: "settings",
    component: DashboardComponent,
    children: [
      {
        path: "service-requests",
        component: ServiceRequestsComponent,
      },
    ],
  },
  {
    path: "custom-rules",
    component: DashboardComponent,
    children: [
      {
        path: "list",
        component: RulesComponent,
      },
      {
        path: "create",
        component: RuleCreateComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "creative-list",
    component: CreativeListComponent,
  },

  {
    path: "forgot-pwd",
    component: ForgotPwdComponent,
  },
  {
    path: "reset/:tokenId/:userId",
    component: ResetPwdComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: ":flight_type/:account_id/campaigns/:campaign_id",
        component: CampaignDetails2Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
