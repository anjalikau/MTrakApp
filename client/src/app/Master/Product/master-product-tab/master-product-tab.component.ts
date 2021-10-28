import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-master-product-tab',
  templateUrl: './master-product-tab.component.html',
  styleUrls: ['./master-product-tab.component.css']
})
export class MasterProductTabComponent implements OnInit {
  user: User;
  prodType: boolean = false;
  prodGroup: boolean = false;
  assignType: boolean = false;
  assignGroup: boolean = false;
  
  constructor(public accountServices: AccountService) { }

  ngOnInit(): void {
    this.accountServices.currentUser$.forEach((element) => {
      this.user = element;
    });
    this.checkMenuPermission();
  }

  checkMenuPermission() {
    var menus = this.user.permitMenus;
    // console.log(menus);
    
    var formMenus = menus.filter((x) => x.mType == 'F'); 
    if (formMenus.filter(x => x.autoIdx == 57 ).length > 0)
        this.prodType = true;
    if (formMenus.filter(x => x.autoIdx == 67 ).length > 0)
        this.prodGroup = true;
    if (formMenus.filter(x => x.autoIdx == 68).length > 0)
        this.assignType = true;
    if (formMenus.filter(x => x.autoIdx == 69).length > 0)
        this.assignGroup = true;
  }

}
