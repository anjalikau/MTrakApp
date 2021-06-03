import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { Company } from 'src/app/_models/company';
import { CustomerDt } from 'src/app/_models/customerDt';
import { CustomerHd } from 'src/app/_models/customerHd';
import { MasterCard } from 'src/app/_models/masterCard';
import { MstrProcess } from 'src/app/_models/mstrProcess';
import { MstrStoreSite } from 'src/app/_models/mstrStoreSite';
import { MstrUnits } from 'src/app/_models/mstrUnits';
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

  getArticleColor(id: number) {
    return this.http.get<Color[]>(this.baseUrl + 'Master/ArtiColor/' + id , httpOptions);
  }

  getArticleSize(id: number) {
    return this.http.get<Size[]>(this.baseUrl + 'Master/ArtiSize/' + id , httpOptions);
  }

  getCustomer(locId: number) {
    return this.http.get<CustomerHd[]>(this.baseUrl + 'Master/Customer/' + locId , httpOptions);
  }

  getCustomerDt(customerId: number) {
    return this.http.get<CustomerDt[]>(this.baseUrl + 'Master/CustomerDt/' + customerId , httpOptions);
  }

  getArticles() {
    return this.http.get<Article[]>(this.baseUrl + 'Master/Articles' , httpOptions);
  }

  getUnits() {
    return this.http.get<MstrUnits[]>(this.baseUrl + 'Master/Units' , httpOptions);
  }

  getStoreSite() {
    return this.http.get<MstrStoreSite[]>(this.baseUrl + 'Master/Storesite' , httpOptions);
  }
  
  getProcess() {
    return this.http.get<MstrProcess[]>(this.baseUrl + 'Master/Process' , httpOptions);
  }

  SaveProcess(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveProcess', model, httpOptions);
  }

  SaveStoreSite(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveStoreSite', model, httpOptions);
  }

  saveUnits(model: any) {
    return this.http.post(this.baseUrl + 'Master/saveunits', model, httpOptions);
  }

  editUnits(MasterUnits: MstrUnits) {
    return this.http.post(this.baseUrl + 'Master/Editunits' , MasterUnits, httpOptions);
  }

}
