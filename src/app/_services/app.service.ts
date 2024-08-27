import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppServices {
  BaseUrl = "/api/";

  // to get project num and name
  private projNameNumber = new BehaviorSubject("");
  currentprojNameNumber = this.projNameNumber.asObservable();

  constructor(private httpClient: HttpClient) {}

  getPageList(accessToken: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + "facebook/pages", {
      headers: httpHeaders,
      params: { accessToken },
    });
  }
  getAdAccountList(accessToken: string, businessId: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + "facebook/ad-accounts", {
      headers: httpHeaders,
      params: { accessToken, businessId },
    });
  }
  getBusinesses(accessToken: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + "facebook/businesses", {
      headers: httpHeaders,
      params: { accessToken },
    });
  }
  getInflightCampaigns() {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + "in-flight/campaigns", {
      headers: httpHeaders,
      // params: { accessToken },
    });
  }
  getPostflightCampaigns() {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + "post-flight/campaigns", {
      headers: httpHeaders,
      // params: { accessToken },
    });
  }
  getCampaignDetails(adAccountId: string, campaignId: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(
      this.BaseUrl + `in-flight/${adAccountId}/campaigns/${campaignId}`,
      {
        headers: httpHeaders,
        params: { adAccountId, campaignId },
      }
    );
  }
  getFacebookVideo(adAccountId: string, videoId: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    });
    return this.httpClient.get(this.BaseUrl + `facebook/video-ads`, {
      headers: httpHeaders,
      params: { adAccountId, videoId },
    });
  }

  getServiceManagerClient(id: number) {
    return this.httpClient.get(
      this.BaseUrl + "/service-managers?clientId=" + id
    );
  }
  logout() {
    return this.httpClient.get(this.BaseUrl + "logout", {
      responseType: "text",
    });
  }

  forgotPwd(emailId: String) {
    return this.httpClient.get(
      this.BaseUrl + "auth/forgotPassword?emailId=" + emailId
    );
  }
  assignServiceRequest(serviceRequestId: number) {
    return this.httpClient.put(
      this.BaseUrl + "service-requests/" + serviceRequestId + "/assign",
      ""
    );
  }
  unassignServiceRequest(serviceRequestId: number) {
    return this.httpClient.put(
      this.BaseUrl + "service-requests/" + serviceRequestId + "/unassign",
      ""
    );
  }
  submitServiceRequest(serviceRequestId: number, formData: any) {
    return this.httpClient.post(
      this.BaseUrl + "service-requests/" + serviceRequestId + "/complete",
      formData
    );
  }

  validateResetLink(tokenId: String, userId: String) {
    return this.httpClient.get(
      this.BaseUrl + "auth/validateResetLink/" + tokenId + "/" + userId
    );
  }

  resetPassword(data: any) {
    return this.httpClient.post(this.BaseUrl + "auth/resetPassword", data);
  }

  getUserObj() {
    return this.httpClient.get(this.BaseUrl + "getUser");
  }

  saveClient(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/create", data);
  }

  editClient(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/update", data);
  }

  updateClientCS(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/update/cs", data);
  }

  updateClientBS(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/update/bs", data);
  }

  addBrandGuideline(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/add/bf", data);
  }

  updateBrandGuideline(data: any) {
    return this.httpClient.post(this.BaseUrl + "client/update/bf", data);
  }

  getBrandGuideline(brandId: string) {
    return this.httpClient.get(
      this.BaseUrl + "client/getBrandDetails/" + brandId
    );
  }

  deleteClient(clientId: String) {
    return this.httpClient.post(
      this.BaseUrl + "client/delete/" + clientId,
      null
    );
  }

  getClientList() {
    return this.httpClient.get(this.BaseUrl + "client/getAllClients");
  }

  getClientExcel() {
    return this.httpClient.get(this.BaseUrl + "client/getExcel", {
      responseType: "blob" as "blob",
    });
  }

  getClientDetails(clientId: String) {
    return this.httpClient.get(this.BaseUrl + "client/getClient/" + clientId);
  }

  saveUser(data: any) {
    return this.httpClient.post(this.BaseUrl + "user/create", data);
  }

  editUser(data: any) {
    return this.httpClient.post(this.BaseUrl + "user/update", data);
  }

  deleteUser(userId: String) {
    return this.httpClient.post(this.BaseUrl + "user/delete/" + userId, null);
  }

  deleteUserAll(userIds: any) {
    return this.httpClient.post(this.BaseUrl + "user/deleteall", userIds);
  }

  getAllUser(clientId: string) {
    return this.httpClient.get(this.BaseUrl + "user/get/" + clientId);
  }

  activateAllUser(userList: any) {
    return this.httpClient.post(this.BaseUrl + "user/activateAll", userList);
  }

  deActivateAllUser(userList: any) {
    return this.httpClient.post(this.BaseUrl + "user/deactivateAll", userList);
  }

  assignBrand(data: any) {
    return this.httpClient.post(this.BaseUrl + "user/updateBrand", data);
  }

  getUserDetails(userId: String) {
    return this.httpClient.get(this.BaseUrl + "user/" + userId);
  }

  getAllPermission(clientId: string) {
    return this.httpClient.get(this.BaseUrl + "permission/get/" + clientId);
  }

  getServiceRequestFormOptions() {
    return this.httpClient.get(this.BaseUrl + "service-requests/form-options");
  }
  getAllServiceRequests(type: string | null, clientId: string) {
    return this.httpClient.get(this.BaseUrl + "service-requests?type=" + type);
  }
  getServiceRequest(id: string) {
    return this.httpClient.get(this.BaseUrl + "service-requests/" + id);
  }

  postServiceRequest(data: any) {
    return this.httpClient.post(this.BaseUrl + "service-requests", data);
  }
  putServiceRequest(id: string, data: any) {
    return this.httpClient.put(this.BaseUrl + "service-requests/" + id, data);
  }

  postServiceManager(data: any) {
    return this.httpClient.post(this.BaseUrl + "service-managers", data);
  }

  putServiceManager(id: string, data: any) {
    return this.httpClient.put(this.BaseUrl + "service-managers/" + id, data);
  }

  getMediaAccounts() {
    return this.httpClient.get(this.BaseUrl + "media-accounts");
  }
  postMediaAccount(data: any) {
    return this.httpClient.post(this.BaseUrl + "media-accounts", data);
  }
  updateMediaAccount(mediaAccountId: string, data: any) {
    return this.httpClient.put(
      this.BaseUrl + "media-accounts/" + mediaAccountId + "/ad-account",
      data
    );
  }
  deletAdAccount(mediaAccountId: string, adAccountId: string) {
    return this.httpClient.delete(
      this.BaseUrl +
        "media-accounts/" +
        mediaAccountId +
        "/ad-accounts/" +
        adAccountId
    );
  }

  deleteServiceManager(clientId: string, id: String) {
    return this.httpClient.put(
      this.BaseUrl + "service-managers/" + clientId + "/delete/" + id,
      {}
    );
  }
  deleteServiceManagerBulk(clientId: string, id: String[]) {
    return this.httpClient.post(
      this.BaseUrl + "service-managers/" + clientId + "/bulk-delete",
      id
    );
  }
  getPermissionDetails(permissionId: string) {
    return this.httpClient.get(this.BaseUrl + "permission/" + permissionId);
  }

  createPermission(data: any) {
    return this.httpClient.post(this.BaseUrl + "permission/create", data);
  }

  updatePermission(data: any) {
    return this.httpClient.post(this.BaseUrl + "permission/edit", data);
  }

  deletePermission(permissionId: string) {
    return this.httpClient.post(
      this.BaseUrl + "permission/delete/" + permissionId,
      null
    );
  }

  deletePermissionAll(permissionIds: any) {
    return this.httpClient.post(
      this.BaseUrl + "permission/deleteall",
      permissionIds
    );
  }

  getCreatePermissionData(clientId: string) {
    return this.httpClient.get(this.BaseUrl + "permission/data/" + clientId);
  }

  getCreateRoleData(clientId: string) {
    return this.httpClient.get(this.BaseUrl + "roles/data/" + clientId);
  }

  getAllRoles(clientId: string) {
    return this.httpClient.get(this.BaseUrl + "roles/get/" + clientId);
  }

  getRoleDetails(roleId: string) {
    return this.httpClient.get(this.BaseUrl + "roles/" + roleId);
  }

  createRole(data: any) {
    return this.httpClient.post(this.BaseUrl + "roles/create", data);
  }

  editRole(data: any) {
    return this.httpClient.post(this.BaseUrl + "roles/edit", data);
  }

  deleteRole(roleId: string) {
    return this.httpClient.post(this.BaseUrl + "roles/delete/" + roleId, null);
  }

  deleteRoleAll(permissionIds: any) {
    return this.httpClient.post(
      this.BaseUrl + "roles/deleteall",
      permissionIds
    );
  }

  getCreatives() {
    return this.httpClient.get(this.BaseUrl + "creatives/list");
  }

  getAllCreativesForClient(clientId: string, phase: string) {
    return this.httpClient.get(
      this.BaseUrl + "creatives/client/" + clientId + "/" + phase
    );
  }
  getAllCreatives(phase: string) {
    return this.httpClient.get(this.BaseUrl + "creatives/all/" + phase);
  }

  getAllCompleted() {
    return this.httpClient.get(this.BaseUrl + "creatives/getAllCompleted");
  }

  getArtifactByBrand() {
    return this.httpClient.get(this.BaseUrl + "creatives/getAllCompleted");
    // if( type==='video'){
    //   return this.httpClient.get(this.BaseUrl + "creatives/getVideosByBrand");
    // } else {
    //   return this.httpClient.get(this.BaseUrl + "creatives/getImagesByBrand");
    // }
  }

  getAdCompareReport(id: string, type: string) {
    if (type === "video") {
      return this.httpClient.get(this.BaseUrl + "abtest/video/" + id);
    } else {
      return this.httpClient.get(this.BaseUrl + "abtest/image/" + id);
    }
  }

  deleteCreatives(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "creatives/delete/" + artifactId);
  }

  getClientCreatives(clientId: string, phase: string) {
    return this.httpClient.get(
      this.BaseUrl + "creatives/client/" + clientId + "/" + phase
    );
  }

  getCampaignCreatives(campaignName: string) {
    return this.httpClient.get(
      this.BaseUrl + "creatives/artifact/" + campaignName
    );
  }

  getCampaignCount(campaignName: string) {
    return this.httpClient.get(
      this.BaseUrl + "creatives/getCount/" + campaignName
    );
  }

  getSharableUserList(brandName: string) {
    return this.httpClient.get(this.BaseUrl + "user/userd/" + brandName);
  }

  createAd(formData: any) {
    return this.httpClient.post(this.BaseUrl + "creatives/create", formData);
  }

  getCreativeDetails(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "creatives/" + artifactId);
  }

  analyzeCreative(artifactId: string) {
    return this.httpClient.post(
      this.BaseUrl + "creatives/analyze/" + artifactId,
      null
    );
  }

  retryAnalyzeCreative(artifactId: string) {
    return this.httpClient.post(
      this.BaseUrl + "creatives/retry/" + artifactId,
      null
    );
  }

  createCamapign(input: any) {
    return this.httpClient.post(this.BaseUrl + "campaign/create", input);
  }

  updateCampaign(input: any) {
    return this.httpClient.post(this.BaseUrl + "campaign/update", input);
  }

  assignCampaign(input: any) {
    return this.httpClient.get(
      this.BaseUrl +
        "campaign/assign/" +
        input.campaignName.toLowerCase() +
        "/" +
        input.artifactId
    );
  }

  shareCampaign(input: any) {
    return this.httpClient.post(this.BaseUrl + "campaign/share", input);
  }

  deleteCampaign(campaignName: string) {
    return this.httpClient.delete(this.BaseUrl + "campaign/" + campaignName);
  }

  getSummaryReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/summary/" + artifactId);
  }

  getRecallReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/recall/" + artifactId);
  }

  getAdCopyReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/ad-copy/" + artifactId);
  }

  getBrandCuesReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/brandcues/" + artifactId);
  }

  getCognitiveReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/cognitive/" + artifactId);
  }

  getEmotionReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/emotion/" + artifactId);
  }

  getDigitalReport(artifactId: string) {
    return this.httpClient.get(
      this.BaseUrl + "report/digitalacc/" + artifactId
    );
  }

  getImageReport(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "report/image/" + artifactId);
  }

  releaseReport(details: any) {
    return this.httpClient.post(this.BaseUrl + "notify/user", details, {
      responseType: "text",
    });
  }

  getStatus(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "edit/status/" + artifactId, {
      responseType: "text",
    });
  }

  getCopyLink(artifactId: string) {
    return this.httpClient.get(this.BaseUrl + "edit/link/" + artifactId);
  }

  preview(artifactId: string, artifactType: string) {
    if (artifactType === "video") {
      return this.httpClient.get(this.BaseUrl + "edit/preview/" + artifactId, {
        responseType: "text",
      });
    } else {
      return this.httpClient.get(
        this.BaseUrl + "edit/preview/image/" + artifactId,
        { responseType: "text" }
      );
    }
  }

  cancel(artifactId: string, artifactType: string) {
    if (artifactType === "video") {
      return this.httpClient.get(this.BaseUrl + "edit/cancel/" + artifactId, {
        responseType: "text",
      });
    } else {
      return this.httpClient.get(
        this.BaseUrl + "edit/cancel/image/" + artifactId,
        { responseType: "text" }
      );
    }
  }

  publish(artifactId: string, artifactType: string) {
    if (artifactType === "video") {
      return this.httpClient.get(this.BaseUrl + "edit/publish/" + artifactId, {
        responseType: "text",
      });
    } else {
      return this.httpClient.get(
        this.BaseUrl + "edit/publish/image/" + artifactId,
        { responseType: "text" }
      );
    }
  }

  revert(artifactId: string, artifactType: string) {
    if (artifactType === "video") {
      return this.httpClient.get(this.BaseUrl + "edit/revert/" + artifactId, {
        responseType: "text",
      });
    } else {
      return this.httpClient.get(
        this.BaseUrl + "edit/revert/image/" + artifactId,
        { responseType: "text" }
      );
    }
  }

  checkName(comapreName: string) {
    return this.httpClient.get(
      this.BaseUrl + "abtest/exist?reportName=" + comapreName
    );
  }

  createCompare(requestObj: any) {
    if (requestObj.id !== "") {
      return this.httpClient.post(this.BaseUrl + "abtest/edit", requestObj);
    }
    return this.httpClient.post(this.BaseUrl + "abtest/create", requestObj);
  }

  getCompare() {
    return this.httpClient.get(this.BaseUrl + "abtest/get");
  }

  deleteABReportsAll(compareIds: any) {
    return this.httpClient.post(this.BaseUrl + "abtest/deleteall", compareIds);
  }

  deleteABReport(compareId: string) {
    return this.httpClient.post(
      this.BaseUrl + "abtest/delete/" + compareId,
      null
    );
  }
  editDisclaimer(userId: String, value: String) {
    return this.httpClient.post(
      this.BaseUrl + "user/updateDis/" + userId,
      value
    );
  }
}
