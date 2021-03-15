import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserListComponent } from './Users/user-list/user-list.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path:'Dashboard', component: DashboardComponent},
      {path:'Home', component: HomeComponent},
      {path:'UserCreation', component: UserDetailComponent },
      {path:'UserList', component: UserListComponent}
    ]
  },  
  {path:'**', component: LoginComponent , pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
