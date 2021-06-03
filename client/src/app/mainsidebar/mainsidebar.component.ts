import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '_services/account.service';
import { User } from '../_models/user';

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

  constructor(public accountServices: AccountService) {}

  ngOnInit(): void {
    this.checkMenuPermission();
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
        this.userReg = false;
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

  ngAfterViewInit() {
    //this.idName.nativeElement.hidden=false;
  }
}
