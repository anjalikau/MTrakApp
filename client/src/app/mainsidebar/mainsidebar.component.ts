import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoldReportComponents } from '@boldreports/angular-reporting-components/core';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { LocalService } from '_services/local.service';
import { RegisterService } from '_services/register.service';
import { PermitMenu } from '../_models/permitMenu';
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
  productionGroup: boolean = false;
  menuList: boolean = false;
  userReg: boolean = false;
  userPermit: boolean = false;
  codeDefi: boolean = false;
  serialNoDt: boolean = false;
  mstrSize: boolean = false;
  mstrColor: boolean = false;
  units: boolean = false;
  process: boolean = false;
  prodDef: boolean = false;
  costingGroup: boolean = false;
  fluteType: boolean = false;
  salesAgent: boolean = false;
  currency: boolean = false;
  countries: boolean = false;
  paymentTerms: boolean = false;
  rejReason: boolean = false;
  product: boolean = false;
  brand: boolean = false;
  materialType: boolean = false;
  category: boolean= false;
  addressType: boolean = false;
  customer: boolean = false;
  flexField: boolean = false;
  article: boolean = false;
  storeSite: boolean = false;
  salesOrder: boolean = false;
  jobCard: boolean = false;
  fpo: boolean = false;
  fpoIn: boolean = false;
  fpoOut: boolean = false;
  qualityCon: boolean = false;
  dispatch: boolean = false;
  costing: boolean = false;
  isCollapsed = false;
  userLoc: UserLocation[];
  user: User;
  public selectedNoValueKey: number[];

  @ViewChild('navMenu', { static: false }) navMenu: ElementRef<HTMLElement>;

  constructor(
    public accountServices: AccountService,
    private router: Router,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    this.accountServices.currentUser$.forEach((element) => {
      this.user = element;
    });

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
    console.log(this.user);

    this.userLoc = this.user.locations;
    var selectRow = this.userLoc.filter((x) => x.isDefault == true);

    selectRow.forEach((element) => {
      this.user['locationId'] = element.companyId;
      // this.user.locations = [];
      // localStorage.setItem('user', JSON.stringify(this.user));
      this.selectedNoValueKey = [element.companyId];
    });

    // var obj = {
    //   "SysModuleId": this.user.moduleId,
    //   "UserId": this.user.userId
    // }

    // this.registerServices.getUserLocation(obj).subscribe(locList => {
    //   console.log(locList);
    //   var user: User = JSON.parse(localStorage.getItem('user'));
    //   this.userLoc = locList;
    //   var selectRow = this.userLoc.filter(x => x.isDefault == true);

    //   selectRow.forEach(element => {
    //     user["locationId"] = element.companyId;
    //     localStorage.setItem('user', JSON.stringify(user));
    //     this.selectedNoValueKey = [element.companyId];
    //   });
    // });
  }

  selectLocation(event) {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    var user: User  = this.user;
    for (const item of event.added) {
      /// loads locations
      user['locationId'] = item;
      this.localService.storagesetJsonValue('user', user);
      // localStorage.setItem('user', JSON.stringify(user));
      //console.log(user);
    }
  }

  logout() {
    this.accountServices.logout();
    this.accountServices.decodedToken = null;
    this.router.navigateByUrl('/');
  }

  checkMenuPermission() {
    var menus = this.user.permitMenus;
    console.log(menus);

    var formMenus = menus.filter((x) => x.mType == 'F');   

    /// USEER PERMITET ADMIN GROUP
    if (formMenus.filter((x) => x.groupName == 'Admin').length > 0) {
      this.adminGroup = true;

      //// SUB MENU OF ADMIN GROUP
      if (formMenus.filter( (x) => x.autoIdx == 35).length > 0)
        this.userPermit = true;
      if (formMenus.filter( (x) => x.autoIdx == 29).length > 0)
        this.userReg = true;
      if (formMenus.filter( (x) => x.autoIdx == 31).length > 0)
        this.menuList = true;
      if (formMenus.filter( (x) => x.autoIdx == 44).length > 0)
        this.codeDefi = true;
      if (formMenus.filter( (x) => x.autoIdx == 45).length > 0)
        this.serialNoDt = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Master').length > 0) {
      this.masterGroup = true;

      //// SUB MENU OF MASTER GROUP
      if (formMenus.filter(x => x.autoIdx == 3 || x.autoIdx == 43 || x.autoIdx == 65).length > 0)
        this.mstrSize = true;
      if (formMenus.filter((x) => x.autoIdx == 2 || x.autoIdx == 42 || x.autoIdx == 66).length > 0)
        this.mstrColor = true;
      if (formMenus.filter((x) => x.autoIdx == 36 || x.autoIdx == 47 ).length > 0)
        this.units = true;
      if (formMenus.filter((x) => x.autoIdx == 37).length > 0)
        this.storeSite = true;
      if (formMenus.filter((x) => x.autoIdx == 48).length > 0)
        this.process = true;
      if (formMenus.filter((x) => x.autoIdx == 49).length > 0)
        this.prodDef = true;
      if (formMenus.filter((x) => x.autoIdx == 50).length > 0)
        this.costingGroup = true;
      if (formMenus.filter((x) => x.autoIdx == 51).length > 0)
        this.fluteType = true;
      if (formMenus.filter((x) => x.autoIdx == 52).length > 0)
        this.salesAgent = true;
      if (formMenus.filter((x) => x.autoIdx == 53).length > 0)
        this.currency = true;
      if (formMenus.filter((x) => x.autoIdx == 54).length > 0)
        this.countries = true;
      if (formMenus.filter((x) => x.autoIdx == 55).length > 0)
        this.paymentTerms = true;
      if (formMenus.filter((x) => x.autoIdx == 56).length > 0)
        this.rejReason = true;
      if (formMenus.filter((x) => x.autoIdx == 57 || x.autoIdx == 67 || x.autoIdx == 68 || x.autoIdx == 69 ).length > 0)
        this.product = true;
      if (formMenus.filter((x) => x.autoIdx == 58 || x.autoIdx == 70).length > 0)
        this.brand = true;
      if (formMenus.filter((x) => x.autoIdx == 59).length > 0)
        this.materialType = true;
      if (formMenus.filter((x) => x.autoIdx == 60).length > 0)
        this.category = true;
      if (formMenus.filter((x) => x.autoIdx == 61).length > 0)
        this.addressType = true;
      if (formMenus.filter((x) => x.autoIdx == 62 || x.autoIdx == 71 || x.autoIdx == 72 || x.autoIdx == 73 
          || x.autoIdx == 74 || x.autoIdx == 75 || x.autoIdx == 76 ).length > 0)
        this.customer = true;
      if (formMenus.filter((x) => x.autoIdx == 63 || x.autoIdx == 77).length > 0)
        this.flexField = true;
      if (formMenus.filter((x) => x.autoIdx == 64 || x.autoIdx == 78 || x.autoIdx == 79).length > 0)
        this.article = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Orders').length > 0) {
      this.salesGroup = true;

      //// SUB MENU OF Order GROUP
      if (formMenus.filter((x) => x.autoIdx == 34).length > 0 )
        this.salesOrder = true;     
      
    }
    if (formMenus.filter((x) => x.groupName == 'Production').length > 0) {
      this.productionGroup = true;

      if (formMenus.filter((x) => x.autoIdx == 80).length > 0 )
        this.jobCard = true;
      if (formMenus.filter((x) => x.autoIdx == 81).length > 0 )
        this.fpo = true;
      if (formMenus.filter((x) => x.autoIdx == 82).length > 0 )
        this.fpoIn = true;
      if (formMenus.filter((x) => x.autoIdx == 83).length > 0 )
        this.fpoOut = true;
      if (formMenus.filter((x) => x.autoIdx == 84).length > 0 )
        this.qualityCon = true;
      if (formMenus.filter((x) => x.autoIdx == 85).length > 0 )
        this.dispatch = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Costing').length > 0) {

      if (formMenus.filter((x) => x.autoIdx == 86).length > 0 )
        this.costing = true;
    }

    //console.log(this.adminGroup);
  }
}
