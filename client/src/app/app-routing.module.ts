import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CustomerHeaderComponent } from './master/customer/customer-header/customer-header.component';
import { CustomerTabComponent } from './master/customer/customer-tab/customer-tab.component';
import { MasterBrandComponent } from './master/master-brand/master-brand.component';
import { MasterBrandcodeComponent } from './master/master-brandcode/master-brandcode.component';
import { MasterCategoryComponent } from './master/master-category/master-category.component';
import { MasterColorComponent } from './master/master-color/master-color.component';
import { MasterCostingGroupComponent } from './master/master-costing-group/master-costing-group.component';
import { MasterMaterialtypeComponent } from './master/master-materialtype/master-materialtype.component';
import { MasterProcessComponent } from './master/master-process/master-process.component';
import { MasterProdDefinitionComponent } from './master/master-prod-definition/master-prod-definition.component';
import { MasterProdTypeComponent } from './master/master-prod-type/master-prod-type.component';
import { MasterProductTabComponent } from './master/master-product-tab/master-product-tab.component';
import { MasterSerialnoDetailsComponent } from './master/master-serialno-details/master-serialno-details.component';
import { MasterSizeComponent } from './master/master-size/master-size.component';
import { MasterStoresiteComponent } from './master/master-storesite/master-storesite.component';
import { MasterUnitsComponent } from './master/master-units/master-units.component';
import { FacProdOrderComponent } from './transaction/fac-prod-order/fac-prod-order.component';
import { JobCreationComponent } from './transaction/job-creation/job-creation.component';
import { SalesOrderComponent } from './transaction/sales-order/sales-order.component';
import { MenuListComponent } from './users/menu-list/menu-list.component';
import { UserPermissionComponent } from './users/user-permission/user-permission.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { AuthGuard } from './_guards/auth.guard';

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
      {path:'MasterColor', component: MasterColorComponent},
      {path:'MasterSize', component: MasterSizeComponent},      
      {path:'MasterUnits', component: MasterUnitsComponent},
      {path:'MasterStoresite', component: MasterStoresiteComponent},
      {path:'MasterProess', component: MasterProcessComponent},
      {path:'MasterBrand', component: MasterBrandComponent},
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
      {path:'FPO', component: FacProdOrderComponent}
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
