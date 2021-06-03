import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MasterColorComponent } from './master/master-color/master-color.component';
import { MasterProcessComponent } from './master/master-process/master-process.component';
import { MasterSizeComponent } from './master/master-size/master-size.component';
import { MasterStoresiteComponent } from './master/master-storesite/master-storesite.component';
import { MasterUnitsComponent } from './master/master-units/master-units.component';
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
      {path:'SalesOrder', component: SalesOrderComponent},
      {path:'MasterUnits', component: MasterUnitsComponent},
      {path:'MasterStoresite', component: MasterStoresiteComponent},
      {path:'MasterProess', component: MasterProcessComponent}
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
