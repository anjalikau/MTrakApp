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
import { AddressType } from 'src/app/_models/addressType';
import { CustomerAddressList } from 'src/app/_models/customerAddressList';
import { CustomerDivision } from 'src/app/_models/customerDivision';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { CostingGroup } from 'src/app/_models/costingGroup';
import { SerialNo } from 'src/app/_models/serialNo';
import { ProductType } from 'src/app/_models/productType';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProdSubCategory } from 'src/app/_models/ProdSubCategory';
import { FlexFieldDetails } from 'src/app/_models/flexFieldDetails';
import { FlexFieldValueList } from 'src/app/_models/flexFieldValueList';
import { CatProdType } from 'src/app/_models/catProdType';
import { ProdTypeGroup } from 'src/app/_models/ProdTypeGroup';
import { ColorAllocation } from 'src/app/_models/colorAllocation';
import { ColorAllocCard } from 'src/app/_models/colorAllocCard';
import { SizeAllocation } from 'src/app/_models/SizeAllocation';
import { SizeAllocCard } from 'src/app/_models/sizeAllocCard';
import { UnitConversion } from 'src/app/_models/unitConversion';
import { FluteType } from 'src/app/_models/fluteType';
import { SpecialInstruction } from 'src/app/_models/specialInstruction';
import { SalesAgent } from 'src/app/_models/salesAgent';
import { Currency } from 'src/app/_models/currency';
import { Countries } from 'src/app/_models/countries';
import { PaymentTerm } from 'src/app/_models/paymentTerm';
import { RejectReasons } from 'src/app/_models/RejectReasons';
import { CodeDefinition } from 'src/app/_models/codeDefinition';
import { SequenceSettings } from 'src/app/_models/sequenceSettings';
import { ArrayType } from '@angular/compiler';
import { ArticleUOMConv } from 'src/app/_models/articleUOMConv';
import { CustomerType } from 'src/app/_models/customerType';
import { InvoiceType } from 'src/app/_models/invoiceType';

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

  getSize() {
    return this.http.get<Size[]>( this.baseUrl + 'Master/Size', httpOptions);
  }

  saveSize(size: Size) {
    return this.http.post(this.baseUrl + 'Master/Size', size, httpOptions);
  }

  saveSizeCard(sizeCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/SizeCard',
      sizeCard,
      httpOptions
    );
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

  getColor() {
    return this.http.get<Color[]>( this.baseUrl + 'Master/Color', httpOptions);
  }

  saveColorCard(colorCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard',
      colorCard,
      httpOptions
    );
  }

  saveColor(color: Color) {
    return this.http.post(this.baseUrl + 'Master/Color', color, httpOptions);
  }

  deactiveColorCard(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard/Deactive',
      model,
      httpOptions
    );
  }

  //#region "Color Allocation"

  getColorAllocDetails(id: number) {
    return this.http.get<ColorAllocation[]>(this.baseUrl + "Master/ColorAlloc/" + id , httpOptions);
  }

  saveColorAllocation(colorAlloc: ColorAllocCard[]) {
    return this.http.post(this.baseUrl + "Master/SaveColorAll" , colorAlloc , httpOptions);
  }

  deleteColorAllocation(colorAlloc: ColorAllocCard[]) {
    return this.http.post(this.baseUrl + "Master/DelColorAll" , colorAlloc , httpOptions);
  }

  //#endregion "Color Allocation"

  //#region "Size Allocation"

  getSizeAllocDetails(id: number) {
    return this.http.get<SizeAllocation[]>(this.baseUrl + "Master/SizeAlloc/" + id , httpOptions);
  }
  
  saveSizeAllocation(sizeAlloc: SizeAllocCard[]) {
    return this.http.post(this.baseUrl + "Master/SaveSizeAll" , sizeAlloc , httpOptions);
  }
  
  deleteSizeAllocation(sizeAlloc: SizeAllocCard[]) {
    return this.http.post(this.baseUrl + "Master/DelSizeAll" , sizeAlloc , httpOptions);
  }
  
    //#endregion "Color Allocation"DelSizeAll

  //#endregion "Color"

  //#region "ArticleColor"

  getArticleColor(id: number) {
    return this.http.get<Color[]>(
      this.baseUrl + 'Master/ArtiColor/' + id,
      httpOptions
    );
  }

  getArticleColorAll(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/ArtiColor/' + id,
      httpOptions
    );
  }

  getArtColorPermitDt(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/GetAtiClr/' + id,
      httpOptions
    );
  }

  saveArtColor(artColor: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArtColor' , artColor, httpOptions );
  }

  deleteArtColor(artColor: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelArtColor' , artColor, httpOptions );
  }

  //#endregion "ArticleColor"

  //#region "ArticleSize"

  getArticleSize(id: number) {
    return this.http.get<Size[]>(
      this.baseUrl + 'Master/ArtiSize/' + id,
      httpOptions
    );
  }

  getArtSizePermitDt(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/GetAtiSize/' + id,
      httpOptions
    );
  }

  saveArticleSize(artSize: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArtSize' , artSize, httpOptions );
  }

  deleteArticleSize(artSize: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelArtSize' , artSize, httpOptions );
  }

  //#endregion "ArticleSize"

  //#region "Article"

  getArticlesAll() {
    return this.http.get<Article[]>(
      this.baseUrl + 'Master/Articles',
      httpOptions
    );
  }

  getCompArticleAll(companyId: number) {
    return this.http.get<Article[]>(this.baseUrl + 'Master/CompArti/' + companyId ,httpOptions);
  }


  getArticlePrices(articleId: number) {
    return this.http.get<any>(this.baseUrl + 'Master/ArtPrice/' + articleId , httpOptions );
  }

  saveArticle(article: any) {
    return this.http.post(this.baseUrl + 'Master/SaveArticle' , article , httpOptions)
  }

  getArticleDetails(article: any) {
    return this.http.post<any>(this.baseUrl + 'Master/ArtProdWise' , article , httpOptions)
  }

  getCCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/CCArticle' , httpOptions)
  }

  getSCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/SCArticle' , httpOptions)
  }

  deactiveArticle(article: any) {
    return this.http.post(this.baseUrl + 'Master/DAArticle' , article , httpOptions)
  }

  deleteArticle(article: any) {
    return this.http.post(this.baseUrl + 'Master/DelArticle' , article , httpOptions)
  }

  //#endregion "Article"

  //#region "CodeDefinition"

  getCodeDefinition(codeDef: any) {
    return this.http.post<CodeDefinition[]>(this.baseUrl + 'Master/CodeDef', codeDef , httpOptions);
  }

  saveCodeDefinition(codeDef: CodeDefinition) {
    return this.http.post(this.baseUrl + 'Master/SaveCDef' , codeDef , httpOptions)
  }

  deleteCodeDefinition(codeDef: any) {
    return this.http.post(this.baseUrl + 'Master/DeleteCDef' , codeDef , httpOptions)
  }

  //#endregion "CodeDefinition"

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

  //#region "Special Instruction"

  getSpecialInstruction() {
    return this.http.get<SpecialInstruction[]>(this.baseUrl + 'Master/SpeInst' , httpOptions);
  }

  //#endregion "Speacial Instruction"
  
  //#region "Unit Conversion"

  getUnitConversion() {
    return this.http.get<UnitConversion[]>(this.baseUrl + 'Master/UnitConv', httpOptions);
  }

  saveUnitConversion(unitConv: UnitConversion) {
    return this.http.post(this.baseUrl + 'Master/SaveUC', unitConv , httpOptions);
  }

  //#endregion "Unit Conversion"

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

  getProcess(locId: number) {
    return this.http.get<Process[]>(
      this.baseUrl + 'Master/Process/' + locId , 
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

  saveAddressType(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveAddType',
      model,
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
      this.baseUrl + 'Master/CusAll/' + LocId,
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

  deactiveCustomerLoc(customerLoc : number) {
    return this.http.post(
      this.baseUrl + 'Master/DeactCusLoc' , customerLoc,
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
      this.baseUrl + 'Master/SaveCD',
      cusDivision,
      httpOptions
    );
  }

  disableCustomerDivision(cusDivision: CustomerDivision) {
    return this.http.post(
      this.baseUrl + 'Master/DisableCD',
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

  deactiveCustomerAddress(cusAddress: CustomerAddressList) {
    return this.http.post(
      this.baseUrl + 'Master/DeactCusAdd', cusAddress, httpOptions);
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
      this.baseUrl + 'Master/SaveCB',
      customerBrand,
      httpOptions
    );
  }

  deleteCustomerBrand(customerBrand: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCB',
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
      this.baseUrl + 'Master/SaveCusC/',
      cusCurrency,
      httpOptions
    );
  }

  deleteCustomerCurrency(cusCurrency: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCusC',
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
    return this.http.get<PaymentTerm[]>(this.baseUrl + 'Master/PayTerms', httpOptions);
  }

  savePaymentTerms(payTerms: PaymentTerm) {
    return this.http.post(this.baseUrl + 'Master/SavePT', payTerms , httpOptions);
  }

  //#endregion "Payment Terms"

  //#region  "Sales Agent"

  getSalesAgent(locId: number) {
    return this.http.get<SalesAgent[]>(this.baseUrl + 'Master/SalesAgent/' + locId, httpOptions);
  }

  saveSalesAgent(salesAgent: SalesAgent) {
    return this.http.post(this.baseUrl + 'Master/SaveSA', salesAgent , httpOptions);
  }

  //#endregion "Sales Agent"

  //#region  "Countries"

  getCountries() {
    return this.http.get<any>(this.baseUrl + 'Master/Countries', httpOptions);
  }

  saveCountries(countries: Countries) {
    return this.http.post(this.baseUrl + 'Master/SaveCou', countries , httpOptions);
  }

  //#endregion "Countries"

  //#region "Currency"

  getCurrency() {
    return this.http.get<Currency[]>(this.baseUrl + 'Master/Currency', httpOptions);
  }

  saveCurrency(currency: Currency) {
    return this.http.post(this.baseUrl + 'Master/SaveCurr', currency , httpOptions);
  }

  //#endregion "Currency"

  //#region "Article UOM Conversion"

  getArticleUOMConversion(articleId: number) {
    return this.http.get<any[]>( this.baseUrl + 'Master/ArtBase/' + articleId, httpOptions );
  } 

  getArticleUOMConvAll(articleId: number) {
    return this.http.get<any[]>( this.baseUrl + 'Master/ArtBaseAll/' + articleId, httpOptions );
  } 

  saveArticleUOMConv(artUOMConv: ArticleUOMConv) {
    return this.http.post(this.baseUrl + 'Master/SaveAUOM', artUOMConv , httpOptions);
  }

  activeArticleUOMConv(artUOMConv: any) {
    return this.http.post(this.baseUrl + 'Master/ActiveAUOM', artUOMConv , httpOptions);
  }

  //#endregion "Article UOM Conversion"

  //#region "Product Definition"

  getProductDefinitionDt(prodHeaderId: number) {
    return this.http.get<ProdDefinition[]>(
      this.baseUrl + 'Master/ProdDefDt/' + prodHeaderId,
      httpOptions
    );
  }

  getProductDefinitionList() {
    return this.http.get<any>(
      this.baseUrl + 'Master/ProdDefList',
      httpOptions
    );
  }

  saveProductDefinition(prodDefinition: ProdDefinition) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdDef', prodDefinition ,
      httpOptions
    );
  }

  deleteProductDefinition(prodDefinition: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteProdDef', prodDefinition ,
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
    return this.http.get<CostingGroup[]>(
      this.baseUrl + 'Master/CostingGroup/' + locId,
      httpOptions
    );
  }

  //#endregion "Costing Group"

  //#region "Flute Type"

  getFluteType(locId: number) {
    return this.http.get<FluteType[]>(
      this.baseUrl + 'Master/FluteType/' + locId,
      httpOptions
    );
  }

  saveFluteType(fluteType: FluteType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveFT', fluteType ,
      httpOptions
    );
  }

  //#endregion "Flute Type" 


  //#region "Serial No"

  saveSeqSettings(serialNo: SequenceSettings) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSeqSett', serialNo ,
      httpOptions
    );
  }

  getSeqSettings(locId: number) {
    return this.http.get<SequenceSettings[]>(
      this.baseUrl + 'Master/SeqSettDt/' + locId,
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
    return this.http.get<ProductType[]>(
      this.baseUrl + 'Master/ProdType/' + catId,
      httpOptions
    );
  }

  getProductTypeAll() {
    return this.http.get<ProductType[]>(
      this.baseUrl + 'Master/ProdType', httpOptions);
  }

  deactiveProductType(prodType: any) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/ProdType', prodType ,
      httpOptions
    );
  }

  assignCatProdType(prodType: any[]) {
    return this.http.post(this.baseUrl + 'Master/AssignCatPT' , prodType , httpOptions);
  }

  deleteCatProdType(prodType: any[]) {
    return this.http.post(this.baseUrl + 'Master/DeleteCatPT' , prodType , httpOptions);
  }

  getCatProdTypeDetails(catId: number) {
    return this.http.get<CatProdType[]>(this.baseUrl + 'Master/CatProdT/' + catId , httpOptions);
  }

  //#endregion "Product Type"

  //#region "Product Group"

  saveProductGroup(prodGroup: ProductGroup) {
    return this.http.post(this.baseUrl + 'Master/SaveProdGroup', prodGroup , httpOptions);
  }

  getProductGroupDt(prodTypeId: number) {
    return this.http.get<any>(this.baseUrl + 'Master/PGroup/' + prodTypeId , httpOptions);
  }

  getProductGroupAll() {
    return this.http.get<any>(this.baseUrl + 'Master/ProdGroup' , httpOptions);
  }  

  deactiveProductGroup(prodGroup: ProductGroup) {
    return this.http.post(this.baseUrl + 'Master/Deactive/ProdGroup', prodGroup , httpOptions);
  }

  getProdTypeGroup(prodTypeId: number) {
    return this.http.get<any[]>(this.baseUrl + 'Master/PTGroup/' + prodTypeId ,httpOptions);
  }

  assignProdTypeGroup(prodType: any[]) {
    return this.http.post(this.baseUrl + 'Master/AssignPGroup/' , prodType ,httpOptions);
  }

  deleteProdTypeGroup(prodType: any[]) {
    return this.http.post(this.baseUrl + 'Master/DeletePGroup/' , prodType ,httpOptions);
  }

  //#endregion "Product Group"

  //#region "Product Sub Category"

  saveProductSubCat(subCat: ProdSubCategory) {
    return this.http.post(this.baseUrl + 'Master/SaveProdSubCat', subCat , httpOptions);
  }

  getProductSubCatDt(groupId: number) {
    return this.http.get<any>(this.baseUrl + 'Master/PSubCat/' + groupId , httpOptions);   
  }

  deactiveProductSubCat(subCat: ProdSubCategory) {
    return this.http.post(this.baseUrl + 'Master/Deactive/PSubCat', subCat , httpOptions);
  }

  //#endregion "Product Sub Category"

   //#region "Flex Field Details"

  saveFlexFieldDetails(flexFieldDt: FlexFieldDetails) {
    return this.http.post(this.baseUrl + 'Master/SaveFlexFDt' , flexFieldDt , httpOptions);
  }

  getFlexFieldDetails(catId: number) {
    return this.http.get<any[]>(this.baseUrl + 'Master/FlexFieldDt/' + catId  , httpOptions);
  }

  deactiveFlexFieldDt(flexFieldDt: FlexFieldDetails) {
    return this.http.post(this.baseUrl + 'Master/Deactive/FlexFldDt' , flexFieldDt  , httpOptions);
  }

  //// GET FLEX FIELD ONLY VALUED 
  getFlexFieldDtList() {
    return this.http.get<any[]>(this.baseUrl + 'Master/FlexFldDt/Val'  , httpOptions);
  }

  /// GET FLEX FIELD LIST RELATED TO CATEGORY AND PROD TYPE
  getFlexFieldCatPTWise(flexFieldDt: any) {
    return this.http.post<any[]>(this.baseUrl + 'Master/FFListCatPT' , flexFieldDt , httpOptions);
  }

  //#endregion "Flex Field Details"

  //#region "Flex Field ValueList"

  saveFlexFieldValList(flexFldValList: FlexFieldValueList) {
    return this.http.post(this.baseUrl + 'Master/SaveFFValList' , flexFldValList , httpOptions);
  }

  getFlexFieldValList(flexFldId: number) {
    return this.http.get<any[]>(this.baseUrl + 'Master/FFValList/' + flexFldId  , httpOptions);
  }

  deleteFlexFieldValList(flexFldValList: any) {
    return this.http.post(this.baseUrl + 'Master/DeleteFFValList' , flexFldValList , httpOptions);
  }

  //#endregion "Flex Field ValueList"
  
  //#region "Reject Reason"

  getRejectReason(locId: number) {
    return this.http.get<RejectReasons[]>(this.baseUrl + 'Master/RejReason/' + locId ,httpOptions);
  }

  saveRejectReason(rejReason: RejectReasons) {
    return this.http.post(this.baseUrl + 'Master/SaveRReason' , rejReason , httpOptions);
  }

  //#endregion
  
  // getCustomerDt(customerId: number) {
  //   return this.http.get<CustomerDt[]>(this.baseUrl + 'Master/CustomerDt/' + customerId , httpOptions);
  // }

  //#region Customer Type

  getCustomerType() {
    return this.http.get<CustomerType[]>(this.baseUrl + 'Master/CusType' , httpOptions);
  }

  //#endregion Customer Type

  //#region Invoice Type

  getInvoiceType() {
    return this.http.get<InvoiceType[]>(this.baseUrl + 'Master/InvType' , httpOptions);
  }

  //#endregion Invoice Type


}
