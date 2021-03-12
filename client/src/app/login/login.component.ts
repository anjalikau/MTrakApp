import { Component, OnInit } from '@angular/core';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(public accountServices: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountServices.login(this.model).subscribe(response =>
      {
      console.log(response);
      }, error => {
        console.log(error);
      });    
  }

  logout() {
    this.accountServices.logout();
  }

}
