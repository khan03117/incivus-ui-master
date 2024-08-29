import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface Rule {
  _id: string;
  name: string;
  clientAdmins: {
    _id: string;
    name: string;
  };
  brands: string[];
  channels: string[];
  isDefault: boolean,
  id: {
    timestamp: string;
    date: dateFns
  }
}
interface RuleObj {
  _id?: string;
  name: string;
  userId: string;
  brandNames: string[];
  channels: string[];
  isDefault: boolean,
  market: string[];

}

interface ApiResponse {
  data: any;
  success: number;
}


interface Range {
  _id: string;
  name: string;
}
const USER_KEY = 'auth-user';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer your-token'
});
@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private apiUrl = '/api/';
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  constructor(private httpClient: HttpClient) { }
  getAllRules(): Observable<Rule[]> {
    return this.httpClient.get<Rule[]>(this.apiUrl + 'custom_rules', { headers: headers, withCredentials: true });
  }

  getRuleWeight(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(this.apiUrl + 'custom_rules_weight_names', { headers: headers, withCredentials: true });
  }
  createRule(rule: RuleObj): Observable<RuleObj> {
    return this.httpClient.post<RuleObj>(this.apiUrl + 'custom_rules', rule, { headers: headers, withCredentials: true });
  }
  rangesScores(): Observable<Range[]> {
    return this.httpClient.get<Range[]>(this.apiUrl + 'custom_rules_range_names', { headers: headers, withCredentials: true });
  }
  getBrandGuideline(brandId: string) {
    return this.httpClient.get(this.apiUrl + "client/getClient/" + brandId);
  }
  saveRuleWeight(obj: any): any {
    return this.httpClient.post(this.apiUrl + "rule_matrix", obj, { headers: headers, withCredentials: true });
  }
  showRule(ruleId: string, creative: string) {
    return this.httpClient.get(this.apiUrl + "rule_matrix?customRuleID=" + ruleId + "&creativeType=" + creative, { headers: headers, withCredentials: true });
  }

}

