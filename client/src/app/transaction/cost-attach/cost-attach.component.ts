import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-cost-attach',
  templateUrl: './cost-attach.component.html',
  styleUrls: ['./cost-attach.component.css'],
})
export class CostAttachComponent implements OnInit {
  costAttachForm: FormGroup;
  user: User;
  salesPrice = 0;
  customerList: CustomerHd[];
  pendSOList: any[];
  soHeaderList: any[];
  costHeaderList: any[];
  saveButton: boolean = false;
  validationErrors: string[] = [];
  rowId: number = 0;

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

  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;

  @ViewChild('closeModal') closeModal: ElementRef

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

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 153).length > 0) {
        this.saveButton = true;
      }
    }

    this.costAttachForm = this.fb.group({
      customer: ['', Validators.required],
      salesOrder: ['', Validators.required],
      soItemId: [0],
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
      this.customerList = customer.filter((x) => x.bActive == true);
    });
  }

  //// ON SELECT CUSTOMER EVENT
  onSelectCustomer(event) {
    this.pendSOList = [];
    this.soHeaderList = [];
    this.costAttachForm.get('salesOrder').setValue(0);

    for (const item of event.added) {
      this.loadPendingSalesOrders(item);
    }
  }

  //// LOADS PENDING SALES ORDERS, WHICH ARE NOT ATTACED COST SHEET
  loadPendingSalesOrders(customerId) {
    this.salesOrderServices.getPendCostSalesOrders(customerId)
      .subscribe((result) => {
        this.pendSOList = result;
      });
  }

  //// CLECK EVENT SALES ORDER NUMBER
  onSelectSalesOrder(event) {
    this.soHeaderList = [];
    for (const item of event.added) {
      this.loadSalesOrderHeader(item);
    }
  }

  ////// LOADS SALES ITEMS DETAILS
  loadSalesOrderHeader(SOHeaderId) {
    this.salesOrderServices.getPendSalesHeader(SOHeaderId)
      .subscribe((result) => {
        this.soHeaderList = result;
        // console.log(this.soHeaderList);
      });
  }

  onLoadCostSheet(event, cellId) {
    const ids = cellId.rowID;
    this.salesPrice = 0;
    this.costAttachForm.get('soItemId').setValue(ids);

    const selectedRowData = this.salesDtGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.salesPrice = selectedRowData[0]['price'];
    // console.log(selectedRowData);
    // var artColorSizeId = selectedRowData[0]['articleColorSizeId'];
    var obj = {
      artColorSizeId: selectedRowData[0]['articleColorSizeId'],
      brandCodeId: selectedRowData[0]['brandCodeId'],
    };

    // console.log(obj);
    this.salesOrderServices.getCostSheetHeader(obj).subscribe((result) => {
      this.costHeaderList = result;
      // console.log(this.costHeaderList);
    });
  }

  //// ATTACH PROCESS CONFIRMATION DIALOG OPEN
  onConfirmationDialog(event, cellId) {
    this.savedialog.open();
    this.rowId = cellId.rowID;
  }

  //// AT CONFIRM SAVING ATTACH COST SHEET
  onSaveSelected(event) {
    this.savedialog.close();
    this.onAttachCostSheet();
  }

  onAttachCostSheet() {
    if (this.saveButton == true) {
      const ids = this.rowId;

      //// GET COST PRICE OF SELECTED COST SHEET
      const selectedRowData = this.costDtGrid.data.filter((record) => {
        return record.autoId == ids;
      });

      // console.log(selectedRowData);
      // console.log(this.salesPrice);
      // var costPrice = selectedRowData[0]['totalBoxCost'];
      /// PRICE MUST BE SAME TO ATTACH COSTING
      // if (costPrice == this.salesPrice) {
      var soHeaderId = this.costAttachForm.get('salesOrder').value;

      var obj = {
        autoId: this.costAttachForm.get('soItemId').value,
        costingId: ids,
        createUserId: this.user.userId,
      };

      this.salesOrderServices.attachCostSheet(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Cost Sheet attach Successfully !!!');
            this.loadSalesOrderHeader(soHeaderId);
            this.closeModal.nativeElement.click();
          } else if (result == -2) {
            this.toastr.warning('Cost sheet already attached !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },
        (error) => {
          this.validationErrors = error;
        }
      );
      // } else {
      //   this.toastr.error('attach fail, price must be same !!!');
      // }
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }
}
