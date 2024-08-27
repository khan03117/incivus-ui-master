import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const CL_LIST = 'client-list';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  clientId: string = "";
  constructor() {}

  clean(): void {
    window.localStorage.clear();
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public saveClientList(clientList: any): void {
    window.localStorage.removeItem(CL_LIST);
    window.localStorage.setItem(CL_LIST, JSON.stringify(clientList));
  }

  public getClientList(): any {
    const clientList = window.localStorage.getItem(CL_LIST);
    if( clientList ) {
      return JSON.parse(clientList);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

}
