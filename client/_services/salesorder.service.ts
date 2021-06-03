import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/_models/article';
import { CustomerDt } from 'src/app/_models/customerDt';
import { CustomerHd } from 'src/app/_models/customerHd';
import { SalesOrder } from 'src/app/_models/salesOrder';
import { environment } from 'src/environments/environment';

var usertoken: any;
//console.log(localStorage);
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
export class SalesorderService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getSalesOrderRef() {
    return this.http.get<SalesOrder>(this.baseUrl + 'SalesOrder/SORefNo' , httpOptions);
  }

  getSalesOrderDT(OrderRef: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SO/' + OrderRef , httpOptions);
  }

  saveSalesOrder(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SOSave' , model , httpOptions);
  }

}
