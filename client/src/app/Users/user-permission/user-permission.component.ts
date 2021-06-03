import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MenuList } from 'src/app/_models/menuList';
import { PermitUser } from 'src/app/_models/permitUser';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  user: User;
  authMenus: MenuList[];
  permitUsers: PermitUser[];
  permitMenus: MenuList[];
  nPermitMenus: MenuList[];
  userPermitForm: FormGroup;
  removeButton = false;
  saveButton = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("Menugrid", { static: true }) 
  public Menugrid: IgxGridComponent;
  @ViewChild("PermitMgrid", { static: true }) 
  public PermitMgrid: IgxGridComponent;

  constructor(private accountService: AccountService ,private fb: FormBuilder, public adminServices: AdminService
          , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.GetButtonPermission()
    this.LoadPermitedUsers();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.userPermitForm = this.fb.group ({
      AgentId : this.user.userId,     
      Agent: ['', Validators.required]
    })
  }

  LoadPermitedUsers(){
    this.adminServices.getPermitedUsers().subscribe(userList => {
      this.permitUsers = userList;
      //console.log(userList);
    });
  }

  /// combo on selection change event loads menus details
  LoadMenusEvent(event){
    /// clear grid data   
    this.ClearGridRows();
    for(const item of event.added) {
      this.LoadUserMenuList(item);
    }
  }

  /// loads menus details related to the selected user
  LoadUserMenuList(userId) {
    this.adminServices.getUserMenuList(userId).subscribe(menuList => {      
      this.permitMenus = menuList.filter(x => x.isPermit == 1); 
      this.nPermitMenus = menuList.filter(x => x.isPermit == 0);
    })
  }

  GetButtonPermission() {    
    this.authMenus = JSON.parse(localStorage.getItem('menus'));    
    //console.log(this.authMenus); 
    if(this.authMenus != null) {
    if(this.authMenus.filter(x => x.menuName == 'Save Menu Permission' && x.mType == 'B').length > 0) {
      this.saveButton = true;
    }
    if(this.authMenus.filter(x => x.menuName == 'Delete Menu Permission' && x.mType == 'B').length > 0) {
      this.removeButton = true;
    }
  }
    //console.log(this.saveButton);
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }

  SaveUserMenuList() {
    var selectedRows = this.Menugrid.selectedRows;
    //console.log(this.userPermitForm.get("Agent").value[0]);
    var SelUserId = this.userPermitForm.get("Agent").value[0];
    var menuList =[];

    selectedRows.forEach(menuId => {      
      var data = {
        "AgentId" : SelUserId,
        "MenuId" : menuId,
        "CreUserID" : this.user.userId
      };

      menuList.push(data);
    });

    //console.log(JSON.stringify(menuList));
    this.adminServices.saveUserMenuList(menuList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("User Menu save Successfully !!!");
        this.ClearGridRows();
        this.LoadUserMenuList(SelUserId);
      } else if (result == -1) {
        this.toastr.warning("User Menu save failed !!!");
        this.ClearGridRows();
        this.LoadUserMenuList(SelUserId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })

  }

  DeleteUserMenuList() {
    //console.log(this.PermitMgrid.selectedRows);
    var selectedRows = this.PermitMgrid.selectedRows;
    var SelUserId = this.userPermitForm.get("Agent").value[0];
    var menuList =[];

    selectedRows.forEach(menuId => {      
      var data = {"AgentId" : SelUserId,
            "MenuId" : menuId,
            "CreUserID" : this.user.userId};

      menuList.push(data);
    });

    //console.log(JSON.stringify(menuList));
    this.adminServices.deleteUserMenuList(menuList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("User Menu delete Successfully !!!");
        this.LoadUserMenuList(SelUserId);
      } else if (result == -1) {
        this.toastr.warning("User Menu delete failed !!!");
        this.LoadUserMenuList(SelUserId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  }

  ClearControls() {
    this.ClearGridRows();
    this.userPermitForm.get('Agent').setValue('');
  }

  ClearGridRows() {
    this.Menugrid.deselectAllRows();
    this.PermitMgrid.deselectAllRows();
    this.permitMenus = [];
    this.nPermitMenus = [];   
  }

 
 

}
