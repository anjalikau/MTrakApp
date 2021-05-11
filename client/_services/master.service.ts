import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from 'src/app/_models/color';
import { Company } from 'src/app/_models/company';
import { MasterCard } from 'src/app/_models/masterCard';
import { Size } from 'src/app/_models/size';
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
export class MasterService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getCompany(moduleId: number) {
    return this.http.get<Company[]>(this.baseUrl + 'Master/Company/' + moduleId , httpOptions);
  }

  getSizeCard() {
    return this.http.get<MasterCard[]>(this.baseUrl + 'Master/SizeCard' , httpOptions);
  }

  getColorCard() {
    return this.http.get<MasterCard[]>(this.baseUrl + 'Master/ColorCard' , httpOptions);
  }

  getSize(sizeCardId: number) {
    return this.http.get<Size[]>(this.baseUrl + 'Master/Size/' + sizeCardId , httpOptions);
  }

  getColor(colorCardId: number) {
    return this.http.get<Color[]>(this.baseUrl + 'Master/Color/' + colorCardId , httpOptions);
  }

  saveSizeCard(sizeCard: MasterCard) {
    return this.http.post(this.baseUrl + 'Master/SizeCard' , sizeCard , httpOptions);
  }

  saveColorCard(colorCard: MasterCard) {
    return this.http.post(this.baseUrl + 'Master/ColorCard' , colorCard, httpOptions);
  }

  saveSize(size: Size) {
    return this.http.post(this.baseUrl + 'Master/Size' , size , httpOptions);
  }

  saveColor(color: Color) {
    return this.http.post(this.baseUrl + 'Master/Color' , color, httpOptions);
  }

  deactiveColorCard(model: any) {
    return this.http.post(this.baseUrl + 'Master/ColorCard/Deactive' , model, httpOptions);
  }

  deactiveSizeCard(model: any) {
    return this.http.post(this.baseUrl + 'Master/SizeCard/Deactive' , model , httpOptions);
  }

}
