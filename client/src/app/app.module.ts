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
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component'
import { UserListComponent } from './Users/user-list/user-list.component';
import { SharedModule } from './_modules/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MainsidebarComponent } from './mainsidebar/mainsidebar.component';
import { FooterComponent } from './footer/footer.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { IgxCheckboxModule, IgxComboModule, IgxDatePickerModule, IgxIconModule, IgxInputGroupModule } from 'igniteui-angular';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { UserPwchangeComponent } from './users/user-pwchange/user-pwchange.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,   
    RegisterComponent,    
    UserListComponent,
    UserDetailComponent,
    DashboardComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MainsidebarComponent,
    FooterComponent,    
    UserRegisterComponent, TextInputComponent, UserPwchangeComponent    
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
    IgxCheckboxModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }