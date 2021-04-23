import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuList } from 'src/app/_models/menuList';
import { MenuUser } from 'src/app/_models/menuUser';
import { PermitUser } from 'src/app/_models/permitUser';
import { environment } from 'src/environments/environment';

var usertoken: any;
if (localStorage.length > 0) {
  usertoken = JSON.parse(localStorage.getItem('user')).token;
  //console.log(usertoken);
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

  constructor(private http: HttpClient) { }

  getAuthMenuList(){
    var userId = JSON.parse(localStorage.getItem('user')).userId;
    return this.http.get<MenuList[]>(this.baseUrl + 'Master/AuthMenus/' + userId , httpOptions);
  }

  saveMenuList(model: any) {
    return this.http.post(this.baseUrl + 'Menu/MenuSave' , model , httpOptions);
  }

  getMenuList() {
    return this.http.get<MenuList[]>(this.baseUrl + 'Master/Menulist', httpOptions);
  }

  getPermitedUsers() {
    var userId = JSON.parse(localStorage.getItem('user')).userId;
    return this.http.get<PermitUser[]>(this.baseUrl + 'Master/Users/' + userId , httpOptions);
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
}
