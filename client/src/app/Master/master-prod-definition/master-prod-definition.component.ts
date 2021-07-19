import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Process } from 'src/app/_models/process';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { StoreSite } from 'src/app/_models/storeSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod-definition',
  templateUrl: './master-prod-definition.component.html',
  styleUrls: ['./master-prod-definition.component.css']
})
export class MasterProdDefinitionComponent implements OnInit {
  prodDefiForm: FormGroup;
  user: User;
  prodDefiList: ProdDefinition[];
  //prodDefiJoin: ProdDefinition[];
  processList: Process[];
  validationErrors: string[] = [];
  storeSiteList: StoreSite[];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  @ViewChild("ProdDefiGrid", { static: true })
  public ProdDefiGrid: IgxGridComponent;

  constructor(private fb: FormBuilder,public adminService: AdminService, private accountService: AccountService
    , private masterService: MasterService , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    this.prodDefiForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      name: ['', [Validators.required, Validators.maxLength(50)]],
      processId: ['', Validators.required],
      receiveSiteId: ['', Validators.required],
      dispatchSiteId: ['', Validators.required]      
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  LoadProductionDefinition() {
    this.masterService.getProductDefinition().subscribe(cardList => {
      this.prodDefiList = cardList;
    })
  }

  LoadStores(){
    this.masterService.getStoreSite().subscribe(cardList => {
      this.storeSiteList = cardList;
    })
  }

  LoadProcess() {
    this.masterService.getProcess().subscribe(cardList => {
      this.processList = cardList;
    })
  }

  LoadProductionJoinlist() {
    this.masterService.getProductDefinition().subscribe(cardList => {
      this.prodDefiList = cardList;
    })
  }

  SaveProdDefinition() {
    var obj = {
      createUserId: this.user.userId,
      name: this.prodDefiForm.get('Name').value.trim(),
      ProcessId: this.prodDefiForm.get('ProcessId').value[0],
      ReceiveSiteId: this.prodDefiForm.get('ReceiveSiteId').value[0],
      DispatchSiteId: this.prodDefiForm.get('DispatchSiteId').value[0],
      autoId: this.prodDefiForm.get('AutoId').value,
    };

    // this.masterService.saveProductDefinition(obj).subscribe((result) => {
    //   if (result == 1) {
    //     this.toastr.success("Production Definition save Successfully !!!");
    //     this.LoadProductionDefinition();
    //     this.cancelMenuList();
    //     this.LoadProductionJoinlist();
    //   } else if (result == 2) {
    //     this.toastr.success("Production Definition update Successfully !!!");
    //     this.LoadProductionDefinition();
    //     this.cancelMenuList();
    //     this.LoadProductionJoinlist();
    //   } else if (result == -1) {
    //     this.toastr.warning("Production Definition already exists !!!");
    //   } else {
    //     this.toastr.warning("Contact Admin. Error No:- " + result.toString());
    //   }
    // }, error => {
    //   this.validationErrors = error;
    // })
  }

  cancelMenuList() {
    this.prodDefiForm.reset();
    this.prodDefiForm.get('AutoId').setValue(0);
    this.prodDefiForm.get('CreateUserId').setValue(this.user.userId);
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  public singleSelectionb(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  public singleSelectionc(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.ProdDefiGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.prodDefiForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.prodDefiForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.prodDefiForm.get('DispatchSiteId').setValue(selectedRowData[0]["dispatchSiteId"]);
    this.prodDefiForm.get('ReceiveSiteId').setValue(selectedRowData[0]["receiveSiteId"]);
    this.prodDefiForm.get('ProcessId').setValue(selectedRowData[0]["processId"]);
  }

}
