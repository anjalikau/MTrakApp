import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';
import { User } from '../_models/user';
import { UserLocation } from '../_models/userLocation';

@Component({
  selector: 'app-mainsidebar',
  templateUrl: './mainsidebar.component.html',
  styleUrls: ['./mainsidebar.component.css'],
})
export class MainsidebarComponent implements OnInit {
  adminGroup: boolean = false;
  masterGroup: boolean = false;
  salesGroup: boolean = false;
  menuList: boolean = false;
  userReg: boolean = false;
  userPermit: boolean = false;
  mstrSize: boolean = false;
  mstrColor: boolean = false;
  salesOrder: boolean = false;
  isCollapsed = false;
  userLoc: UserLocation[];
  user: User;
  public selectedNoValueKey: number[]; 

  @ViewChild('navMenu' , { static: false }) navMenu: ElementRef<HTMLElement>;

  constructor(public accountServices: AccountService , private registerServices: RegisterService 
    ,private router: Router) {}

  ngOnInit(): void {
    this.loadUserLocation();
    this.checkMenuPermission();    
  }

  menuClose() {    
    this.navMenu.nativeElement.click(); 
  }

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

  checkMenuPermission() {
    var menus: User = JSON.parse(localStorage.getItem('user'));
    var formMenus = menus.permitMenus.filter((x) => x.mType == 'F');
    //console.log(formMenus);

    /// USEER PERMITET ADMIN GROUP
    if (formMenus.filter((x) => x.groupName == 'Admin').length > 0) {
      this.adminGroup = true;

      //// SUB MENU OF ADMIN GROUP
      if (formMenus.filter((x) => x.groupName == 'Admin' && x.menuName == 'UserPermission').length > 0)
        this.userPermit = true;
      if (formMenus.filter((x) => x.groupName == 'Admin' && x.menuName == 'UserRegister').length > 0)
        this.userReg = true;
      if (formMenus.filter((x) => x.groupName == 'Admin' && x.menuName == 'MenuList').length > 0)
        this.menuList = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Master').length > 0) {      
      this.masterGroup = true;

      //// SUB MENU OF MASTER GROUP
      if (formMenus.filter((x) => x.groupName == 'Master' && x.menuName == 'MasterSize').length > 0)
        this.mstrSize = true;
      if (formMenus.filter((x) => x.groupName == 'Master' && x.menuName == 'MasterColor').length > 0)
        this.mstrColor = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Sales').length > 0) {
      this.salesGroup = true;
      
      //// SUB MENU OF SALES GROUP
      if (formMenus.filter((x) => x.groupName == 'Sales' && x.menuName == 'SalesOrder').length > 0)
        this.salesOrder = true;
    }

    //console.log(this.adminGroup);
  }

 
}
