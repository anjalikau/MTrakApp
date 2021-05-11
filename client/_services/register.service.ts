import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { DelUserModule } from 'src/app/_models/delUserModule';
import { Member } from 'src/app/_models/member';
import { SysModule } from 'src/app/_models/SysModule';
import { UserLevel } from 'src/app/_models/userLevel';
import { UserModule } from 'src/app/_models/userModule';
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

  getLocation(model: any) {
    return this.http.post<Location[]>(this.baseUrl + 'Agents/Location/' , model , httpOptions);
  }

  userRegister(model: any) {
     return this.http.post(this.baseUrl + 'account/register', model, httpOptions);
  }

  moduleRegister(module: UserModule[]) {
    return this.http.post(this.baseUrl + 'account/regModule', module, httpOptions);
 }

  getUserLevel() {
    var userId = JSON.parse(localStorage.getItem('user')).userId;
    console.log(httpOptions);
    return this.http.get<UserLevel[]>(this.baseUrl + 'Agents/AgentLevel/' + userId , httpOptions);
  }

  changeUserPassword(userName: string , user: Member) {
    return this.http.put(this.baseUrl + 'Agents/' + userName , user , httpOptions);
  } 
  
  getSysModules() {
    return this.http.get<SysModule[]>(this.baseUrl + 'Agents/Module' );
  }

  getUserModule(id: number) {
    return this.http.get<UserModule[]>(this.baseUrl + 'Agents/Users/Module/' + id , httpOptions);
  }

  saveUserModule(userModule: UserModule[]) {
    return this.http.post(this.baseUrl + 'Agents/UserModSave' , userModule, httpOptions)
  }

  deleteUserModule(userModule: DelUserModule) {
    return this.http.post(this.baseUrl + 'Agents/UserModDelete' , userModule, httpOptions)
  }

 

  }
