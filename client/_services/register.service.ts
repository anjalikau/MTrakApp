import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factory } from 'src/app/_models/factory';
import { Member } from 'src/app/_models/member';
import { MenuList } from 'src/app/_models/menuList';
import { UserLevel } from 'src/app/_models/userLevel';
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
export class RegisterService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsres() {
    return this.http.get<Member[]>(this.baseUrl + 'Agents' , httpOptions);
  }

  getUser(id: number){
    return this.http.get<Member[]>(this.baseUrl + 'Agents' + id , httpOptions);
  }

  getUserByName(userName: number) {
    return this.http.get<Member[]>(this.baseUrl + 'Agents/name/' + userName , httpOptions);
  }

  getFactories() {
    return this.http.get<Factory[]>(this.baseUrl + 'Master/Factory' , httpOptions);
  }

  userRegister(model: any) {
     return this.http.post(this.baseUrl + 'account/register', model, httpOptions);
  }

  getUserLevel() {
    var userId = JSON.parse(localStorage.getItem('user')).userId;
    console.log(httpOptions);
    return this.http.get<UserLevel[]>(this.baseUrl + 'Master/AgentLevel/' + userId , httpOptions);
  }

  changeUserPassword(userName: string , user: Member) {
    return this.http.put(this.baseUrl + 'Agents/' + userName , user , httpOptions);
  }  

  }
