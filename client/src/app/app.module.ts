import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './_modules/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MainsidebarComponent } from './mainsidebar/mainsidebar.component';
import { FooterComponent } from './footer/footer.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { IgxActionStripModule, IgxAvatarModule, IgxCardModule, IgxCheckboxModule, IgxComboModule, IgxDatePickerModule, IgxDialogModule, IgxDividerModule, IgxGridModule, IgxHierarchicalGridModule, IgxIconModule, IgxInputGroupModule, IgxMaskModule, IgxRadioModule, IgxTabsModule, IgxTooltipModule } 
from 'igniteui-angular';
import { UserPwchangeComponent } from './users/user-pwchange/user-pwchange.component';
import { MenuListComponent } from './users/menu-list/menu-list.component';
import { UserPermissionComponent } from './users/user-permission/user-permission.component';
import { ModuleRegisterComponent } from './users/module-register/module-register.component';
import { MasterSizeComponent } from './master/size/master-size/master-size.component';
import { MasterColorComponent } from './master/color/master-color/master-color.component';
import { MasterColorCardComponent } from './master/color/master-color-card/master-color-card.component';
import { MasterSizeCardComponent } from './master/size/master-size-card/master-size-card.component';
import { DatePipe } from '@angular/common';
import { SalesOrderComponent } from './transaction/sales-order/sales-order.component';
import { MasterStoresiteComponent } from './master/master-storesite/master-storesite.component';
import { MasterUnitsComponent } from './master/unit/master-units/master-units.component';
import { MasterProcessComponent } from './master/master-process/master-process.component';
import { JobCreationComponent } from './transaction/job-creation/job-creation.component';
import { MasterBrandComponent } from './master/brand/master-brand/master-brand.component';
import { MasterBrandcodeComponent } from './master/brand/master-brandcode/master-brandcode.component';
import { MasterMaterialtypeComponent } from './master/master-materialtype/master-materialtype.component';
import { MasterCategoryComponent } from './master/master-category/master-category.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomerTabComponent } from './master/customer/customer-tab/customer-tab.component';
import { CustomerHeaderComponent } from './master/customer/customer-header/customer-header.component';
import { CustomerUserComponent } from './master/customer/customer-user/customer-user.component';
import { CustomerAddressComponent } from './master/customer/customer-address/customer-address.component';
import { CustomerBrandComponent } from './master/customer/customer-brand/customer-brand.component';
import { CustomerDivisionComponent } from './master/customer/customer-division/customer-division.component';
import { CustomerCurrencyComponent } from './master/customer/customer-currency/customer-currency.component';
import { CustomerDefaultComponent } from './master/customer/customer-default/customer-default.component';
import { CustomerLocationsComponent } from './master/customer/customer-locations/customer-locations.component';
import { FacProdOrderComponent } from './transaction/fac-prod-order/fac-prod-order.component';
import { MasterProdDefinitionComponent } from './master/master-prod-definition/master-prod-definition.component';
import { MasterCostingGroupComponent } from './master/master-costing-group/master-costing-group.component';
import { MasterProdTypeComponent } from './master/product/master-prod-type/master-prod-type.component';
import { MasterProdGroupComponent } from './master/product/master-prod-group/master-prod-group.component';
import { MasterProdSubCategoryComponent } from './master/product/master-prod-sub-category/master-prod-sub-category.component';
import { MasterSerialnoDetailsComponent } from './master/master-serialno-details/master-serialno-details.component';
import { MasterProductTabComponent } from './master/product/master-product-tab/master-product-tab.component';
import { FlexFieldDetailsComponent } from './master/article/flex-field-details/flex-field-details.component';
import { FlexFieldValueListComponent } from './master/article/flex-field-value-list/flex-field-value-list.component';
import { FlexFieldTabComponent } from './master/article/flex-field-tab/flex-field-tab.component';
import { MasterArticleComponent } from './master/article/master-article/master-article.component';
import { AppComponentComponent } from './master/article/app-component/app-component.component';
import { AssignProdtypeCatComponent } from './master/product/assign-prodtype-cat/assign-prodtype-cat.component';
import { AssignProdgroupTypeComponent } from './master/product/assign-prodgroup-type/assign-prodgroup-type.component';
import { ProductionInComponent } from './transaction/production/production-in/production-in.component';
import { ProductionOutComponent } from './transaction/production/production-out/production-out.component';
import { QualityControlComponent } from './transaction/production/quality-control/quality-control.component';
import { ProdDispatchComponent } from './transaction/prod-dispatch/prod-dispatch.component';
import { ReportViewerComponent } from './report/report-viewer/report-viewer.component';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';

import { BoldreportViewerComponent } from './report/boldreport-viewer/boldreport-viewer.component';
import { ColorTabComponent } from './master/color/color-tab/color-tab.component';
import { ColorAllocCardComponent } from './master/color/color-alloc-card/color-alloc-card.component';
import { SizeTabComponent } from './master/size/size-tab/size-tab.component';
import { SizeAllocCardComponent } from './master/size/size-alloc-card/size-alloc-card.component';
import { CostingComponent } from './transaction/costing/costing.component';
import { CostListComponent } from './transaction/cost-list/cost-list.component';
import { ArticleTabComponent } from './master/article/article-tab/article-tab.component';
import { AssignColorComponent } from './master/article/assign-color/assign-color.component';
import { AssignSizeComponent } from './master/article/assign-size/assign-size.component';
import { UnitConversionComponent } from './master/unit/unit-conversion/unit-conversion.component';
import { UnitTabComponent } from './master/unit/unit-tab/unit-tab.component';
import { FluteTypeComponent } from './master/flute-type/flute-type.component';
import { SalesAgentComponent } from './master/sales-agent/sales-agent.component';
import { CurrencyComponent } from './master/currency/currency.component';
import { CountriesComponent } from './master/countries/countries.component';
import { PaymentTermsComponent } from './master/payment-terms/payment-terms.component';
import { RejectReasonComponent } from './master/reject-reason/reject-reason.component';
import { CodeDefinitionComponent } from './users/code-definition/code-definition.component';
import { AddressTypeComponent } from './master/address-type/address-type.component';
import { NgYasYearPickerModule } from 'ngy-year-picker';
import { CostAttachComponent } from './transaction/cost-attach/cost-attach.component';
import { ArticleUmoConversionComponent } from './master/article/article-umo-conversion/article-umo-conversion.component';
import { BrandTabComponent } from './master/brand/brand-tab/brand-tab.component';
import { ExchangeRateComponent } from './finance/exchange-rate/exchange-rate.component';

// Report viewer
// import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';

// data-visualization
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,     
    DashboardComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MainsidebarComponent,
    FooterComponent,    
    UserRegisterComponent, 
    UserPwchangeComponent, 
    MenuListComponent, 
    UserPermissionComponent, 
    ModuleRegisterComponent, 
    MasterSizeComponent, 
    MasterColorComponent, 
    MasterColorCardComponent, 
    MasterSizeCardComponent, 
    SalesOrderComponent,
    MasterStoresiteComponent,
    MasterUnitsComponent,
    MasterProcessComponent,
    JobCreationComponent,
    MasterBrandComponent,
    MasterBrandcodeComponent,
    MasterMaterialtypeComponent,
    MasterCategoryComponent,
    CustomerTabComponent,
    CustomerHeaderComponent,
    CustomerUserComponent,
    CustomerAddressComponent,
    CustomerBrandComponent,
    CustomerDivisionComponent,
    CustomerCurrencyComponent,
    CustomerDefaultComponent,
    CustomerLocationsComponent,
    FacProdOrderComponent,
    MasterProdDefinitionComponent,
    MasterCostingGroupComponent,
    MasterProdTypeComponent,
    MasterProdGroupComponent,
    MasterProdSubCategoryComponent,
    MasterSerialnoDetailsComponent,
    MasterProductTabComponent,
    FlexFieldDetailsComponent,
    FlexFieldValueListComponent,
    FlexFieldTabComponent,
    MasterArticleComponent,
    AppComponentComponent,
    AssignProdtypeCatComponent,
    AssignProdgroupTypeComponent,
    ProductionInComponent,
    ProductionOutComponent,
    QualityControlComponent,
    ProdDispatchComponent,
    ReportViewerComponent,
    BoldreportViewerComponent,
    ColorTabComponent,
    ColorAllocCardComponent,
    SizeTabComponent,
    SizeAllocCardComponent,
    CostingComponent,
    CostListComponent,
    ArticleTabComponent,
    AssignColorComponent,
    AssignSizeComponent,
    UnitConversionComponent,
    UnitTabComponent,
    FluteTypeComponent,
    SalesAgentComponent,
    CurrencyComponent,
    CountriesComponent,
    PaymentTermsComponent,
    RejectReasonComponent,
    CodeDefinitionComponent,
    AddressTypeComponent,
    CostAttachComponent,
    ArticleUmoConversionComponent,
    BrandTabComponent,
    ExchangeRateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IgxIconModule,
    BrowserAnimationsModule,
    SharedModule,
    CollapseModule.forRoot(), 
    IgxDatePickerModule,
    IgxComboModule,
    IgxInputGroupModule,
    IgxCheckboxModule,
    IgxRadioModule,
    IgxGridModule,
    IgxTabsModule,
    IgxMaskModule,
    IgxActionStripModule,
    IgxAvatarModule,
    IgxTooltipModule,
    IgxDialogModule,
    IgxCardModule,
	  IgxDividerModule,
    ReportViewerModule,
    BoldReportViewerModule,
    IgxHierarchicalGridModule,
    NgYasYearPickerModule
  ],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
