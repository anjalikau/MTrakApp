import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApproveRouteModule } from 'src/app/_models/approveRouteModule';
import { ApproveUsers } from 'src/app/_models/approveUsers';
import { MenuList } from 'src/app/_models/menuList';
import { MenuUser } from 'src/app/_models/menuUser';
import { PermitUser } from 'src/app/_models/permitUser';
import { User } from 'src/app/_models/user';
import { UserAppModules } from 'src/app/_models/userAppModules';
import { environment } from 'src/environments/environment';
import { LocalService } from './local.service';

var usertoken: any;
//console.log(localStorage);
if (localStorage.length > 0) {
  usertoken = localStorage.getItem('token');
  // console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private localService: LocalService) { }

  user: User = this.localService.getJsonValue('user');

  saveMenuList(model: any) {
    return this.http.post(this.baseUrl + 'Menu/MenuSave' , model , httpOptions);
  }

  getMenuList() {
    return this.http.get<MenuList[]>(this.baseUrl + 'Master/Menulist', httpOptions);
  }

  getPermitedUsers() {
    // var userId = JSON.parse(localStorage.getItem('user')).userId;
    var userId = this.user.userId;
    return this.http.get<PermitUser[]>(this.baseUrl + 'Agents/Users/' + userId , httpOptions);
  }

  getUserMenuList(userId) {
    //var userId = JSON.parse(localStorage.getItem('user')).userId;
    return this.http.get<MenuList[]>(this.baseUrl + 'Master/UserMenus/' + userId , httpOptions);
  }

  saveUserMenuList(menuUser: MenuUser[]) {
    return this.http.post(this.baseUrl + 'Menu/MenuUserSave' , menuUser , httpOptions);
  }

  deleteUserMenuList(model: any) {
    return this.http.post(this.baseUrl + 'Menu/MenuUserDelete' , model , httpOptions);
  }

  SetDefaultLocation(userLoc: any) {
    return this.http.post(this.baseUrl + 'Master/Loc/SetDefault', userLoc , httpOptions);
  }

  getUserAppModuleList(userId: any) {
    return this.http.get<UserAppModules[]>(this.baseUrl + 'Menu/UserAM/'  + userId , httpOptions);
  }

  getModuleList() {
    return this.http.get<MenuList[]>(this.baseUrl + 'Menu/Modules' , httpOptions);
  }

  saveApproveRouteModule(appModule: ApproveRouteModule) {
    return this.http.post(this.baseUrl + 'Menu/ARMSave' , appModule , httpOptions);
  }

  getApproveUsers(armId: number) {
    return this.http.get<ApproveUsers[]>(this.baseUrl + 'Menu/AppUsers/' + armId  , httpOptions);
  }

  saveApproveUsers(approveUser: any) {
    return this.http.post(this.baseUrl + 'Menu/AppUserSave' , approveUser  , httpOptions);
  }

  deleteApproveModule(approveModule: any) {
    return this.http.post(this.baseUrl + 'Menu/AppModDelete' , approveModule  , httpOptions);
  }

  deleteApproveUsers(approveUser: any) {
    return this.http.post(this.baseUrl + 'Menu/AppUserDelete' , approveUser  , httpOptions);
  }
}
