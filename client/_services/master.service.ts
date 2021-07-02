import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { Company } from 'src/app/_models/company';
import { CustomerDt } from 'src/app/_models/customerDt';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Size } from 'src/app/_models/size';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/_models/category';
import { MaterialType } from 'src/app/_models/materialType';
import { Card } from 'src/app/_models/card';
import { Units } from 'src/app/_models/units';
import { StoreSite } from 'src/app/_models/storeSite';
import { Process } from 'src/app/_models/process';
import { Brand } from 'src/app/_models/brand';
import { BrandCode } from 'src/app/_models/brandCode';

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
    return this.http.get<Card[]>(this.baseUrl + 'Master/SizeCard' , httpOptions);
  }

  getColorCard() {
    return this.http.get<Card[]>(this.baseUrl + 'Master/ColorCard' , httpOptions);
  }

  getSize(sizeCardId: number) {
    return this.http.get<Size[]>(this.baseUrl + 'Master/Size/' + sizeCardId , httpOptions);
  }

  getColor(colorCardId: number) {
    return this.http.get<Color[]>(this.baseUrl + 'Master/Color/' + colorCardId , httpOptions);
  }

  saveSizeCard(sizeCard: Card) {
    return this.http.post(this.baseUrl + 'Master/SizeCard' , sizeCard , httpOptions);
  }

  saveColorCard(colorCard: Card) {
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
    return this.http.get<Units[]>(this.baseUrl + 'Master/Units' , httpOptions);
  }

  getStoreSite() {
    return this.http.get<StoreSite[]>(this.baseUrl + 'Master/Storesite' , httpOptions);
  }
  
  getProcess() {
    return this.http.get<Process[]>(this.baseUrl + 'Master/Process' , httpOptions);
  }

  saveProcess(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveProcess', model, httpOptions);
  }

  saveStoreSite(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveStoreSite', model, httpOptions);
  }

  saveUnits(model: any) {
    return this.http.post(this.baseUrl + 'Master/saveunits', model, httpOptions);
  }

  editUnits(units: Units) {
    return this.http.post(this.baseUrl + 'Master/Editunits' , units, httpOptions);
  }

  getCategory() {
    return this.http.get<Category[]>(this.baseUrl + 'Master/Category' , httpOptions);
  }

  getMaterialType() {
    return this.http.get<MaterialType[]>(this.baseUrl + 'Master/MaterialType' , httpOptions);
  }

  saveCategory(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveCategory', model, httpOptions);
  }

  saveMaterialType(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveMaterialType', model, httpOptions);
  }

  getBrand() {
    return this.http.get<Brand[]>(this.baseUrl + 'Master/Brand' , httpOptions);
  }

  getBrandCode(brandId: number) {
    return this.http.get<BrandCode[]>(this.baseUrl + 'Master/BrandCode/' + brandId , httpOptions);
  }

  saveBrand(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveBrand', model, httpOptions);
  }

  saveBrandCode(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveBrandCode', model, httpOptions);
  }

  getCustomerHeader() {
    return this.http.get<CustomerHd[]>(this.baseUrl + 'Master/CustomerHeader' , httpOptions);
  }

  saveCustomerHeader(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveCustomerHd', model, httpOptions);
  }

  getCustomerDetails(CustomerId: number) {
    return this.http.get<CustomerDt[]>(this.baseUrl + 'Master/CustomerDt/' + CustomerId , httpOptions);
  }

  saveCustomerDetails(model: any) {
    return this.http.post(this.baseUrl + 'Master/SaveCustomerDt', model, httpOptions);
  }

  deactiveCustomerHeader(model: any) {
    return this.http.post(this.baseUrl + 'Master/CustHdDeactive' , model , httpOptions);
  }

  getCustomerUser(id: number) {
    return this.http.get<any>(this.baseUrl + 'Master/CustomerUser/' + id , httpOptions);
  }

  getSalesCategory() {
    return this.http.get<any>(this.baseUrl + 'Master/SalesCat' , httpOptions);
  }

  getCustomCurrency(id: number) {
    return this.http.get<any>(this.baseUrl + 'Master/Currency/' + id , httpOptions);
  }

  getPaymentTerms() {
    return this.http.get<any>(this.baseUrl + 'Master/PayTerms' , httpOptions);
  }

  getSalesAgent() {
     return this.http.get<any>(this.baseUrl + 'Master/SalesAgent' , httpOptions);
  }

  getCountries() {
    return this.http.get<any>(this.baseUrl + 'Master/Countries' , httpOptions);
  }

  getCurrency() {
    return this.http.get<any>(this.baseUrl + 'Master/Currency' , httpOptions);
  }

  getCustomerDivision(customerId) {
    return this.http.get<any>(this.baseUrl + 'Master/CusDivision/' + customerId , httpOptions);
  }

}
