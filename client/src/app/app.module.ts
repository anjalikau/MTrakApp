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
import { IgxActionStripModule, IgxAvatarModule, IgxCardModule, IgxCheckboxModule, IgxComboModule, IgxDatePickerModule, IgxDialogModule, IgxDividerModule, IgxGridModule, IgxIconModule, IgxInputGroupModule, IgxMaskModule, IgxTabsModule, IgxTooltipModule } 
from 'igniteui-angular';
import { UserPwchangeComponent } from './users/user-pwchange/user-pwchange.component';
import { MenuListComponent } from './users/menu-list/menu-list.component';
import { UserPermissionComponent } from './users/user-permission/user-permission.component';
import { ModuleRegisterComponent } from './users/module-register/module-register.component';
import { MasterSizeComponent } from './master/master-size/master-size.component';
import { MasterColorComponent } from './master/master-color/master-color.component';
import { MasterColorCardComponent } from './master/master-color-card/master-color-card.component';
import { MasterSizeCardComponent } from './master/master-size-card/master-size-card.component';
import { DatePipe } from '@angular/common';
import { SalesOrderComponent } from './transaction/sales-order/sales-order.component';
import { MasterStoresiteComponent } from './master/master-storesite/master-storesite.component';
import { MasterUnitsComponent } from './master/master-units/master-units.component';
import { MasterProcessComponent } from './master/master-process/master-process.component';
import { JobCreationComponent } from './transaction/job-creation/job-creation.component';
import { MasterBrandComponent } from './master/master-brand/master-brand.component';
import { MasterBrandcodeComponent } from './master/master-brandcode/master-brandcode.component';
import { MasterMaterialtypeComponent } from './master/master-materialtype/master-materialtype.component';
import { MasterCategoryComponent } from './master/master-category/master-category.component';
import { GridWithTransactionsComponent } from './transaction/grid-with-transactions/grid-with-transactions.component';
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
    GridWithTransactionsComponent,
    CustomerTabComponent,
    CustomerHeaderComponent,
    CustomerUserComponent,
    CustomerAddressComponent,
    CustomerBrandComponent,
    CustomerDivisionComponent,
    CustomerCurrencyComponent,
    CustomerDefaultComponent,
    CustomerLocationsComponent
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
    IgxGridModule,
    IgxTabsModule,
    IgxMaskModule,
    IgxActionStripModule,
    IgxAvatarModule,
    IgxTooltipModule,
    IgxDialogModule,
    IgxCardModule,
	  IgxDividerModule   
  ],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
