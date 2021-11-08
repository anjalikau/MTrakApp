import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FlexFieldTabComponent } from './master/article/flex-field-tab/flex-field-tab.component';
import { CustomerTabComponent } from './master/customer/customer-tab/customer-tab.component';
import { MasterBrandcodeComponent } from './master/brand/master-brandcode/master-brandcode.component';
import { MasterCategoryComponent } from './master/master-category/master-category.component';
import { MasterCostingGroupComponent } from './master/master-costing-group/master-costing-group.component';
import { MasterMaterialtypeComponent } from './master/master-materialtype/master-materialtype.component';
import { MasterProcessComponent } from './master/master-process/master-process.component';
import { MasterProdDefinitionComponent } from './master/master-prod-definition/master-prod-definition.component';
import { MasterProductTabComponent } from './master/product/master-product-tab/master-product-tab.component';
import { MasterSerialnoDetailsComponent } from './master/master-serialno-details/master-serialno-details.component';
import { MasterStoresiteComponent } from './master/master-storesite/master-storesite.component';
import { FacProdOrderComponent } from './transaction/fac-prod-order/fac-prod-order.component';
import { JobCreationComponent } from './transaction/job-creation/job-creation.component';
import { SalesOrderComponent } from './transaction/sales-order/sales-order.component';
import { MenuListComponent } from './users/menu-list/menu-list.component';
import { UserPermissionComponent } from './users/user-permission/user-permission.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProductionInComponent } from './transaction/production/production-in/production-in.component';
import { ProductionOutComponent } from './transaction/production/production-out/production-out.component';
import { QualityControlComponent } from './transaction/production/quality-control/quality-control.component';
import { ProdDispatchComponent } from './transaction/prod-dispatch/prod-dispatch.component';
import { ReportViewerComponent } from './report/report-viewer/report-viewer.component';
import { BoldreportViewerComponent } from './report/boldreport-viewer/boldreport-viewer.component';
import { ColorTabComponent } from './master/color/color-tab/color-tab.component';
import { SizeTabComponent } from './master/size/size-tab/size-tab.component';
import { CostingComponent } from './transaction/costing/costing.component';
import { ArticleTabComponent } from './master/article/article-tab/article-tab.component';
import { UnitTabComponent } from './master/unit/unit-tab/unit-tab.component';
import { FluteTypeComponent } from './master/flute-type/flute-type.component';
import { SalesAgentComponent } from './master/sales-agent/sales-agent.component';
import { CurrencyComponent } from './master/currency/currency.component';
import { CountriesComponent } from './master/countries/countries.component';
import { PaymentTermsComponent } from './master/payment-terms/payment-terms.component';
import { RejectReasonComponent } from './master/reject-reason/reject-reason.component';
import { CodeDefinitionComponent } from './users/code-definition/code-definition.component';
import { AddressTypeComponent } from './master/address-type/address-type.component';
import { CostAttachComponent } from './transaction/cost-attach/cost-attach.component';
import { ArticleUmoConversionComponent } from './master/article/article-umo-conversion/article-umo-conversion.component';
import { BrandTabComponent } from './master/brand/brand-tab/brand-tab.component';
import { ExchangeRateComponent } from './finance/exchange-rate/exchange-rate.component';
import { TaxComponent } from './finance/tax/tax.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path:'Dashboard', component: DashboardComponent },
      {path:'Home', component: HomeComponent},
      {path:'UserRegister', component: UserRegisterComponent },
      {path:'MenuList', component: MenuListComponent},
      {path:'UserPermission', component: UserPermissionComponent},
      {path:'ColorTab', component: ColorTabComponent},
      {path:'SizeTab', component: SizeTabComponent},
      {path:'MasterStoresite', component: MasterStoresiteComponent},
      {path:'MasterProess', component: MasterProcessComponent},
      {path:'Brand', component: BrandTabComponent},
      {path:'MasterBrandCode', component: MasterBrandcodeComponent},
      {path:'MasterMaterialtype', component: MasterMaterialtypeComponent},
      {path:'MasterCategory', component: MasterCategoryComponent},
      {path:'MasterCustomer', component: CustomerTabComponent},
      {path:'ProdDefinition', component: MasterProdDefinitionComponent},
      {path:'CostingGroup', component: MasterCostingGroupComponent},
      {path:'SerialNoDetails', component: MasterSerialnoDetailsComponent},
      {path:'ProductMenu', component: MasterProductTabComponent},
      {path:'SalesOrder', component: SalesOrderComponent},
      {path:'Job', component: JobCreationComponent},
      {path:'FPO', component: FacProdOrderComponent},
      {path:'FlexField', component: FlexFieldTabComponent},
      {path:'Article', component: ArticleTabComponent},
      {path:'FPPOIn', component: ProductionInComponent},
      {path:'FPPOOut', component: ProductionOutComponent},
      {path:'QualityC', component: QualityControlComponent},
      {path:'Dispatch', component: ProdDispatchComponent},
      {path:'Report', component: ReportViewerComponent},
      {path:'boldreport', component: BoldreportViewerComponent },
      {path:'Costing', component: CostingComponent},
      {path:'Unit', component: UnitTabComponent},
      {path:'FluteType', component: FluteTypeComponent},
      {path:'SalesAgent', component: SalesAgentComponent},
      {path:'Currency', component: CurrencyComponent},
      {path:'Countries', component: CountriesComponent},
      {path:'PayTerms', component: PaymentTermsComponent},
      {path:'RejReason', component: RejectReasonComponent},
      {path:'CodeDefinition', component: CodeDefinitionComponent},
      {path:'AddressType', component: AddressTypeComponent},
      {path:'CostAttach', component: CostAttachComponent},
      {path:'ArticleUOM', component: ArticleUmoConversionComponent},
      {path:'ExchangeRate', component: ExchangeRateComponent},
      {path:'Tax', component: TaxComponent}
    ]
  },  
  {path:'not-found', component: NotFoundComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'errors', component: TestErrorsComponent},  
  {path:'**', component: NotFoundComponent , pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
