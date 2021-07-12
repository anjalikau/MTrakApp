import { error } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';
import { User } from '../_models/user';
import { UserLocation } from '../_models/userLocation';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isCollapsed = false;
  userLoc: UserLocation[];
  user: User;
  public selectedNoValueKey: number[]; 

  @ViewChild('navMenu') navMenu: ElementRef<HTMLElement>;

  constructor(private accountServices: AccountService , private registerServices: RegisterService
      ,private router: Router) { }

  ngOnInit(): void {    
    this.loadUserLocation();    
  }

  // login() {
  //   this.accountServices.login(this.model).subscribe(response =>
  //     {
  //     console.log(response);
  //     }, error => {
  //       console.log(error);
  //     });    
  // }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  
  loadUserLocation() {
    //var compList = []; var locations: any = [];
    this.accountServices.currentUser$.forEach(element => {
      this.user = element;
      });    

    var obj = {
      "SysModuleId": this.user.moduleId,
      "UserId": this.user.userId
    }

    this.registerServices.getUserLocation(obj).subscribe(locList => { 
      //console.log(locList);
      var user: User = JSON.parse(localStorage.getItem('user'));      
      this.userLoc = locList;
      var selectRow = this.userLoc.filter(x => x.isDefault == true);

      selectRow.forEach(element => {
        user["locationId"] = element.companyId;
        localStorage.setItem('user', JSON.stringify(user));
        this.selectedNoValueKey = [element.companyId];
      });
    });
    
  }
  
  selectLocation(event) {
    var user: User = JSON.parse(localStorage.getItem('user'));
    for(const item of event.added) {
      /// loads locations
      user["locationId"] = item; 
      localStorage.setItem('user', JSON.stringify(user));
      //console.log(user);   
    }
  }

  logout() {
    this.accountServices.logout();
    this.accountServices.decodedToken = null;
    this.router.navigateByUrl('/');
  }



}
