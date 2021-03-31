import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  users: any;

  constructor(public accountServices: AccountService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountServices.login(this.model).subscribe(response =>
      {
        //console.log(response);
        this.setCurrentUser();
        this.router.navigateByUrl('/Dashboard');
      });    
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountServices.setCurrentUser(user);
    //console.log(user);
  }


  

}
