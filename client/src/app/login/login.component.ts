import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  users: any;

  constructor(public accountServices: AccountService, private router: Router
      ,private adminService: AdminService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountServices.login(this.model).subscribe(response =>
      {
        //console.log(response);
        this.setCurrentUser();
        this.router.navigateByUrl('/Dashboard');
        //console.log(this.accountServices.decodedToken?.unique_name);
      });    
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountServices.setCurrentUser(user);
    this.getAuthMenuList();
    //console.log(user);
  }

  getAuthMenuList() {    
    this.adminService.getAuthMenuList().subscribe(response => {
      const menus = response;
      localStorage.setItem('menus', JSON.stringify(menus));
    });
  }
  

}
