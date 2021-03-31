import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
  title = 'MTrack';
  users: any;

  constructor(private http: HttpClient, public accountServices: AccountService) {}

  ngOnInit() {
   //this.getUsers();
   this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountServices.setCurrentUser(user);
    //console.log(user);
  }

  // getUsers() {
  //   this.http.get('https://localhost:5001/api/Agents').subscribe(response => {
  //     this.users = response;
  //   }, error =>{
  //     console.log(error);
  //   });
  // }
}
