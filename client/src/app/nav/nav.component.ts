import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '_services/account.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  //model: any = {};

  constructor(public accountServices: AccountService,private router: Router) { }

  ngOnInit(): void {
  }

  // login() {
  //   this.accountServices.login(this.model).subscribe(response =>
  //     {
  //     console.log(response);
  //     }, error => {
  //       console.log(error);
  //     });    
  // }

  logout() {
    this.accountServices.logout();
    this.router.navigateByUrl('/');
  }



}
