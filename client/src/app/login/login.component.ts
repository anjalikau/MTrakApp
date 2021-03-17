import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(public accountServices: AccountService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountServices.login(this.model).subscribe(response =>
      {
        //console.log(response);
        this.router.navigateByUrl('/Dashboard');
      });    
  }

  

}
