import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-cost-attach',
  templateUrl: './cost-attach.component.html',
  styleUrls: ['./cost-attach.component.css']
})
export class CostAttachComponent implements OnInit {
  costAttachForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  pendSOList: any[];
  soHeaderList: any[];
  costHeaderList: any[];
  validationErrors: string[] = [];  
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;  

  @ViewChild('salesDtGrid', { static: true })
  public salesDtGrid: IgxGridComponent;
  @ViewChild('costDtGrid', { static: true })
  public costDtGrid: IgxGridComponent;

  @ViewChild('salesOrder', { read: IgxComboComponent })
  public salesOrder: IgxComboComponent;
  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;

  constructor(
    private fb: FormBuilder,
    private accountServices: AccountService,
    private masterServices: MasterService,
    private salesOrderServices: SalesorderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomer();
  }

  initilizeForm() {
    this.accountServices.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.costAttachForm = this.fb.group({
      customer: ['', Validators.required],
      salesOrder: ['', Validators.required],
      soItemId: [0]
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadCustomer() {
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
    });
  }

  //// ON SELECT CUSTOMER EVENT
  onSelectCustomer(event) {
    this.pendSOList = [];
    for (const item of event.added) {
      this.loadPendingSalesOrders(item);
    }
  }

  //// LOADS PENDING SALES ORDERS, WHICH ARE NOT ATTACED COST SHEET
  loadPendingSalesOrders(customerId) {
    this.salesOrderServices.getPendCostSalesOrders(customerId).subscribe( result => {
      this.pendSOList = result
    })
  }

  //// CLECK EVENT SALES ORDER NUMBER
  onSelectSalesOrder(event) {
    this.soHeaderList= [];
    for (const item of event.added) {
      this.loadSalesOrderHeader(item);
    }
  }

  ////// LOADS SALES ITEMS DETAILS
  loadSalesOrderHeader(SOHeaderId) {
    this.salesOrderServices.getPendSalesHeader(SOHeaderId).subscribe( result => {
      this.soHeaderList = result
      // console.log(this.soHeaderList);
    })
  }

  onLoadCostSheet(event, cellId) {    
    const ids = cellId.rowID;
    this.costAttachForm.get("soItemId").setValue(ids);

    const selectedRowData = this.salesDtGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    // console.log(selectedRowData);
    var artColorSizeId = selectedRowData[0]["articleColorSizeId"];
    this.salesOrderServices.getCostSheetHeader(artColorSizeId).subscribe(result => {
      this.costHeaderList = result;
      // console.log(this.costHeaderList);
    })
  }

  onAttachCostSheet(event, cellId) {
    const ids = cellId.rowID;
    var soHeaderId = this.costAttachForm.get("salesOrder").value;

    var obj = {
      autoId: this.costAttachForm.get("soItemId").value,
      costingId: ids,
      createUserId: this.user.userId
    };

    // console.log(obj);

    this.salesOrderServices.attachCostSheet(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success("Cost Sheet attach Successfully !!!");
        this.loadSalesOrderHeader(soHeaderId);  
      } else if (result == -2) {
        this.toastr.warning("Cost sheet already attached !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }      
    }, error => {
      this.validationErrors = error;
    }) 
  }
 

}
