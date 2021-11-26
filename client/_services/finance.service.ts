import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank } from 'src/app/_models/bank';
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

getBank() {
  return this.http.get<any>(this.baseUrl + 'Finance/Bank' , httpOptions);
}

saveBank(bank: Bank) {
  return this.http.post(this.baseUrl + 'Finance/SaveBank' , bank , httpOptions);
}

getInvoicePendingDt(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/PInvoice/' + customerId, httpOptions);
}

saveInvoice(invoiceDt: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveInvoice' , invoiceDt , httpOptions);
}

getInvoiceDetails(invoiceNo: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/GetInvDt/' + invoiceNo, httpOptions);
}

approveInvoice(invoiceHd: any) {
  return this.http.post(this.baseUrl + 'Finance/AppInvoice' , invoiceHd , httpOptions);
}

}
