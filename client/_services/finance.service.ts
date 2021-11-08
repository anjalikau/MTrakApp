import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRate } from 'src/app/_models/exchangeRate';
import { Tax } from 'src/app/_models/tax';
import { environment } from 'src/environments/environment';

var usertoken: any;

if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
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

export class FinanceService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

saveExchangeRate(exchRate: ExchangeRate) {
  return this.http.post(this.baseUrl + 'Finance/SaveExR' , exchRate , httpOptions);
}

getExchangeRate() {
  return this.http.get<any>(this.baseUrl + 'Finance/ExRate' , httpOptions);
}

getTax() {
  return this.http.get<any>(this.baseUrl + 'Finance/Rate' , httpOptions);
}

saveTax(tax: Tax) {
  return this.http.post(this.baseUrl + 'Finance/SaveTax' , tax , httpOptions);
}

}
