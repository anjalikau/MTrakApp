import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { Company } from 'src/app/_models/company';
import { CustomerLoc } from 'src/app/_models/customerLoc';
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
import { CustomerCurrency } from 'src/app/_models/customerCurrency';
import { CustomerBrand } from 'src/app/_models/CustomerBrand';
import { CustomerUser } from 'src/app/_models/customerUser';
import { AddressType } from 'src/app/_models/AddressType';
import { CustomerAddressList } from 'src/app/_models/customerAddressList';
import { CustomerDivision } from 'src/app/_models/customerDivision';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { CostingGroup } from 'src/app/_models/costingGroup';
import { SerialNo } from 'src/app/_models/serialNo';
import { ProductType } from 'src/app/_models/productType';

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
  providedIn: 'root',
})
export class MasterService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompany(moduleId: number) {
    return this.http.get<Company[]>(
      this.baseUrl + 'Master/Company/' + moduleId,
      httpOptions
    );
  }

  //#region "Size"

  getSizeCard() {
    return this.http.get<Card[]>(this.baseUrl + 'Master/SizeCard', httpOptions);
  }

  getSize(sizeCardId: number) {
    return this.http.get<Size[]>(
      this.baseUrl + 'Master/Size/' + sizeCardId,
      httpOptions
    );
  }

  saveSizeCard(sizeCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/SizeCard',
      sizeCard,
      httpOptions
    );
  }

  saveColor(color: Color) {
    return this.http.post(this.baseUrl + 'Master/Color', color, httpOptions);
  }

  deactiveSizeCard(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SizeCard/Deactive',
      model,
      httpOptions
    );
  }

  //#endregion "Size"

  //#region "Color"

  getColorCard() {
    return this.http.get<Card[]>(
      this.baseUrl + 'Master/ColorCard',
      httpOptions
    );
  }

  getColor(colorCardId: number) {
    return this.http.get<Color[]>(
      this.baseUrl + 'Master/Color/' + colorCardId,
      httpOptions
    );
  }

  saveColorCard(colorCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard',
      colorCard,
      httpOptions
    );
  }

  saveSize(size: Size) {
    return this.http.post(this.baseUrl + 'Master/Size', size, httpOptions);
  }

  deactiveColorCard(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard/Deactive',
      model,
      httpOptions
    );
  }

  //#endregion "Color"

  //#region "ArticleColor"

  getArticleColor(id: number) {
    return this.http.get<Color[]>(
      this.baseUrl + 'Master/ArtiColor/' + id,
      httpOptions
    );
  }

  //#endregion "ArticleColor"

  //#region "ArticleSize"

  getArticleSize(id: number) {
    return this.http.get<Size[]>(
      this.baseUrl + 'Master/ArtiSize/' + id,
      httpOptions
    );
  }

  //#endregion "ArticleSize"

  //#region "Article"

  getArticles() {
    return this.http.get<Article[]>(
      this.baseUrl + 'Master/Articles',
      httpOptions
    );
  }

  //#endregion "Article"

  //#region "Units"

  getUnits() {
    return this.http.get<Units[]>(this.baseUrl + 'Master/Units', httpOptions);
  }

  saveUnits(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/saveunits',
      model,
      httpOptions
    );
  }

  editUnits(units: Units) {
    return this.http.post(
      this.baseUrl + 'Master/Editunits',
      units,
      httpOptions
    );
  }

  //#endregion "Units"

  //#region  "StoreSite"

  getStoreSite() {
    return this.http.get<StoreSite[]>(
      this.baseUrl + 'Master/Storesite',
      httpOptions
    );
  }

  saveStoreSite(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveStoreSite',
      model,
      httpOptions
    );
  }

  //#endregion "StoreSite"

  //#region "Process"

  getProcess() {
    return this.http.get<Process[]>(
      this.baseUrl + 'Master/Process',
      httpOptions
    );
  }

  saveProcess(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProcess',
      model,
      httpOptions
    );
  }

  //#endregion "Process"

  //#region "Category"

  getCategory() {
    return this.http.get<Category[]>(
      this.baseUrl + 'Master/Category',
      httpOptions
    );
  }

  saveCategory(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCategory',
      model,
      httpOptions
    );
  }

  //#endregion "Category"

  //#region "MaterialType"

  getMaterialType() {
    return this.http.get<MaterialType[]>(
      this.baseUrl + 'Master/MaterialType',
      httpOptions
    );
  }

  saveMaterialType(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveMaterialType',
      model,
      httpOptions
    );
  }

  //#endregion "MaterialType"

  //#region "Brand / Brand Code"

  getBrand(locId: number) {
    return this.http.get<Brand[]>(
      this.baseUrl + 'Master/Brand/' + locId,
      httpOptions
    );
  }

  getBrandCode(brandId: number) {
    return this.http.get<BrandCode[]>(
      this.baseUrl + 'Master/BrandCode/' + brandId,
      httpOptions
    );
  }

  saveBrand(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveBrand',
      model,
      httpOptions
    );
  }

  saveBrandCode(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveBrandCode',
      model,
      httpOptions
    );
  }

  //#endregion "Brand / Brand Code"

  //#region "AddressType"

  getAddressType() {
    return this.http.get<AddressType[]>(
      this.baseUrl + 'Master/AddressType',
      httpOptions
    );
  }

  //#endregion "AddressType"

  //#region "Customer Header"

  getCustomer(locId: number) {
    return this.http.get<CustomerHd[]>(
      this.baseUrl + 'Master/Customer/' + locId,
      httpOptions
    );
  }

  getCustomerHdAll(LocId: number) {
    return this.http.get<CustomerHd[]>(
      this.baseUrl + 'Master/CustomerHd/All/' + LocId,
      httpOptions
    );
  }

  saveCustomerHeader(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCustomerHd',
      model,
      httpOptions
    );
  }

  deactiveCustomerHeader(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/CustHdDeactive',
      model,
      httpOptions
    );
  }

  //#endregion "Customer Header"

  //#region "Customer Location"

  getCustomerLocation(CustomerId: number) {
    return this.http.get<CustomerLoc[]>(
      this.baseUrl + 'Master/CustomerLoc/' + CustomerId,
      httpOptions
    );
  }

  saveCustomerLocation(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCustomerLoc',
      model,
      httpOptions
    );
  }

  //#endregion "Customer Location"

  //#region  "Customer Division"

  getCustomerDivision(customerId) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusDivision/' + customerId,
      httpOptions
    );
  }

  saveCustomerDivision(cusDivision: CustomerDivision) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusDivision',
      cusDivision,
      httpOptions
    );
  }

  //#endregion "Customer Division"

  //#region "Customer Address"

  saveCustomerAddress(cusAddress: CustomerAddressList) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusAddress',
      cusAddress,
      httpOptions
    );
  }

  getCustomerAddressList(customerId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/CusAddress/' + customerId,
      httpOptions
    );
  }

  //#endregion "Customer Address"

  //#region "Customer User"

  getCustomerUser(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CustomerUser/' + customerId,
      httpOptions
    );
  }

  getCustomerUserAll(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CustomerUser/All/' + customerId,
      httpOptions
    );
  }

  saveCustomerUser(cusUser: CustomerUser) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusUser',
      cusUser,
      httpOptions
    );
  }

  deactiveCustomerUser(cusUser: any) {
    return this.http.post(
      this.baseUrl + 'Master/CusUser/Deactive',
      cusUser,
      httpOptions
    );
  }

  //#endregion "Customer User"

  //#region "Customer Brand"

  getCustomerBrand(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusBrand/' + customerId,
      httpOptions
    );
  }

  saveCustomerBrand(customerBrand: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/Save/CusBrand',
      customerBrand,
      httpOptions
    );
  }

  deleteCustomerBrand(customerBrand: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/Delete/CusBrand',
      customerBrand,
      httpOptions
    );
  }

  //#endregion "Customer Brand"

  //#region "Customer Currency"

  getCustomCurrency(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusCurrency/' + id,
      httpOptions
    );
  }

  saveCustomerCurrency(cusCurrency: CustomerCurrency) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusCurrency/',
      cusCurrency,
      httpOptions
    );
  }

  deleteCustomerCurrency(cusCurrency: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCusCurrency/',
      cusCurrency,
      httpOptions
    );
  }

  //#endregion "Customer Currency"

  //#region  "Sales Category"

  getSalesCategory() {
    return this.http.get<any>(this.baseUrl + 'Master/SalesCat', httpOptions);
  }

  //#endregion "Sales Category"

  //#region  "Payment Terms"

  getPaymentTerms() {
    return this.http.get<any>(this.baseUrl + 'Master/PayTerms', httpOptions);
  }

  //#endregion "Payment Terms"

  //#region  "Sales Agent"

  getSalesAgent() {
    return this.http.get<any>(this.baseUrl + 'Master/SalesAgent', httpOptions);
  }

  //#endregion "Sales Agent"

  //#region  "Countries"

  getCountries() {
    return this.http.get<any>(this.baseUrl + 'Master/Countries', httpOptions);
  }

  //#endregion "Countries"

  //#region "Currency"

  getCurrency() {
    return this.http.get<any>(this.baseUrl + 'Master/Currency', httpOptions);
  }

  //#endregion "Currency"

  //#region "Product Type"

  //#endregion "Product Type"

  //#region "Product Definition"

  getProductDefinition() {
    return this.http.get<any>(
      this.baseUrl + 'Master/ProdDefinition',
      httpOptions
    );
  }

  saveProductDefinition(prodDefinition: ProdDefinition) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdDef', prodDefinition ,
      httpOptions
    );
  }

  //#endregion "Product Definition"

  //#region "Costing Group"

  saveCostingGroup(costGroup: CostingGroup) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCostGroup', costGroup ,
      httpOptions
    );
  }

  getCostingGroup(locId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CostingGroup/' + locId,
      httpOptions
    );
  }

  //#endregion "Costing Group"

  //#region "Serial No"

  saveSerialNoDetails(serialNo: SerialNo) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSerialNo', serialNo ,
      httpOptions
    );
  }

  getSerialNoDetails(locId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/SerialNoDt/' + locId,
      httpOptions
    );
  }

  //#endregion "Serial No"

  //#region "Product Type"

  saveProductType(prodType: ProductType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdType', prodType ,
      httpOptions
    );
  }

  getProductTypeDetils(catId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/ProdType/' + catId,
      httpOptions
    );
  }

  deactiveProductType(prodType: any) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/ProdType', prodType ,
      httpOptions
    );
  }

  //#endregion "Product Type"

  // getCustomerDt(customerId: number) {
  //   return this.http.get<CustomerDt[]>(this.baseUrl + 'Master/CustomerDt/' + customerId , httpOptions);
  // }
}
