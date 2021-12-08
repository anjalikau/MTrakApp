import { DatePipe } from '@angular/common';
import { Component, OnInit, TRANSLATIONS, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { DispatchProdDt } from 'src/app/_models/dispatchProdDt';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-prod-dispatch',
  templateUrl: './prod-dispatch.component.html',
  styleUrls: ['./prod-dispatch.component.css'],
})
export class ProdDispatchComponent implements OnInit {
  dispatchForm: FormGroup;
  qtyEditForm: FormGroup;
  user: User;
  custometList: CustomerHd[];
  delLocationList: CustomerLoc[];
  pendDispatchList: DispatchProdDt[];
  dispatchList: any[];
  dispSiteList: any[];
  rowId: number = 0;
  // isGridDisabled: boolean = false;
  isDisplayMode: boolean = false;
  dispatchStatus: string;
  isActive: boolean = false;
  // clickFPODelete: boolean = false;
  cusLocId: number;
  isCustomer: boolean = false;
  isFromSite: boolean = false;
  article: string = '';
  saveButton: boolean = false;
  cancelButton: boolean = false;
  printButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('pendDispatchGrid', { read: IgxGridComponent, static: true })
  public pendDispatchGrid: IgxGridComponent;
  @ViewChild('dispatchGrid', { read: IgxGridComponent, static: true })
  public dispatchGrid: IgxGridComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('cusLoc', { read: IgxComboComponent })
  public cusLoc: IgxComboComponent;
  @ViewChild('fromSites', { read: IgxComboComponent })
  public fromSites: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private masterServices: MasterService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getDispatchNo();
    this.loadCustomer();
    this.loadDispatchSite();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 163).length > 0) {
        this.saveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 164).length > 0) {
        this.cancelButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 165).length > 0) {
        this.printButton = true;
      }
    }

    this.dispatchForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      dispatchNo: ['', [Validators.required, Validators.maxLength(30)]],
      customer: ['', [Validators.required]],
      cusLocation: ['', Validators.required],
      fromSite: ['', Validators.required],
      reason: ['', Validators.maxLength(50)],
      transDate: [{ value: date, disabled: true }],
    });

    this.qtyEditForm = this.fb.group({
      autoId: [0],
      soItemId: [0],
      soDelivDtId: [0],
      orderRef: [{ value: '', disabled: true }],
      deliveryRef: [{ value: '', disabled: true }],
      article: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      prodQty: [{ value: 0, disabled: true }],
      balQty: [{ value: 0, disabled: true }],
      lastDispQty: [{ value: 0, disabled: true }],
      dispatchQty: [0, Validators.required],
    });
  }

  ///// GET DISPATCH NO
  getDispatchNo() {
    this.dispatchForm.get('dispatchNo').setValue('');
    this.salesOrderServices.getRefNumber('DispatchNo').subscribe((result) => {
      // console.log(result.refNo);
      this.dispatchForm.get('dispatchNo').setValue(result.refNo.toString());
    });
  }

  //// GET CUSTOMER LIST REALTED TO THE LOGGING LOACTION
  loadCustomer() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((result) => {
      this.custometList = result;
    });
  }

  loadDispatchSite() {
    this.salesOrderServices.getDispatchSite().subscribe((result) => {
      this.dispSiteList = result;
      console.log(this.dispSiteList);
    });
  }

  /// LOAD DELIVERY LOCATION
  onCustomerSelect(event) {
    this.isCustomer = false;
    for (const item of event.added) {
      this.isCustomer = true;
      this.masterServices.getCustomerLocation(item).subscribe((result) => {
        this.delLocationList = result;
      });
    }
  }

  /// FROM SITE SELECTED
  onFromSiteSelect(event) {
    this.isFromSite = false;
    for (const item of event.added) {
      this.isFromSite = true;
    }
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  /// DISPATCH NO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode != 13) {
      var date: Date = new Date(Date.now());

      this.dispatchForm.get('autoId').reset();
      this.dispatchForm.get('customer').reset();
      this.dispatchForm.get('cusLocation').reset();
      this.dispatchForm.get('fromSite').reset();
      this.dispatchForm.get('reason').reset();
      this.dispatchForm.get('transDate').setValue(date);

      this.qtyEditForm.reset();
      this.pendDispatchList = [];
      this.dispatchList = [];
      this.isDisplayMode = false;
      this.isCustomer = false;
      this.isFromSite = false;
      this.isActive = false;
      this.dispatchStatus = '';
      this.enableControls();
    } else {
      this.loadDipatchDetails();
    }
  }

  /// LOADS PENDING DISPATCH DETAILS
  getPendDispatchDetails() {
    if (!this.isDisplayMode) {
      this.pendDispatchList = [];
      this.dispatchList = [];
      this.qtyEditForm.reset();

      var obj = {
        dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
        customerId: this.dispatchForm.get('customer').value[0],
      };

      this.salesOrderServices
        .getPendDispatchDetails(obj)
        .subscribe((result) => {
          this.pendDispatchList = result;
          // console.log(this.pendDispatchList);
        });
    }
  }

  ///// SHOW SELECTED LINE TO EDIT
  onPendingDispatchDown(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.pendDispatchGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.qtyEditForm.reset();
    this.qtyEditForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.qtyEditForm.get('orderRef').setValue(selectedRowData[0]['orderRef']);
    this.qtyEditForm
      .get('deliveryRef')
      .setValue(selectedRowData[0]['deliveryRef']);
    this.qtyEditForm.get('article').setValue(selectedRowData[0]['articleName']);
    this.qtyEditForm.get('color').setValue(selectedRowData[0]['color']);
    this.qtyEditForm.get('size').setValue(selectedRowData[0]['size']);
    this.qtyEditForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.qtyEditForm
      .get('soDelivDtId')
      .setValue(selectedRowData[0]['soDelivDtId']);
    this.qtyEditForm.get('prodQty').setValue(selectedRowData[0]['prodQty']);
    this.qtyEditForm.get('balQty').setValue(selectedRowData[0]['balQty']);
    this.qtyEditForm
      .get('lastDispQty')
      .setValue(selectedRowData[0]['dispatchedQty']);
  }

  onDispatchEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.dispatchGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var balQty =
      selectedRowData[0]['prodQty'] - selectedRowData[0]['lastDispQty'];

    this.qtyEditForm.reset();
    this.qtyEditForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.qtyEditForm.get('orderRef').setValue(selectedRowData[0]['orderRef']);
    this.qtyEditForm
      .get('deliveryRef')
      .setValue(selectedRowData[0]['deliveryRef']);
    this.qtyEditForm.get('article').setValue(selectedRowData[0]['articleName']);
    this.qtyEditForm.get('color').setValue(selectedRowData[0]['color']);
    this.qtyEditForm.get('size').setValue(selectedRowData[0]['size']);
    this.qtyEditForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.qtyEditForm
      .get('soDelivDtId')
      .setValue(selectedRowData[0]['soDelivDtId']);
    this.qtyEditForm.get('prodQty').setValue(selectedRowData[0]['prodQty']);
    this.qtyEditForm.get('balQty').setValue(balQty);
    this.qtyEditForm
      .get('lastDispQty')
      .setValue(selectedRowData[0]['lastDispQty']);
    // console.log(selectedRowData);
  }

  ////// VALIDATE DISPATCH QTY AND ADD TO DISPATCHED GRID
  addDispatchQtyGrid() {
    var balQty = this.qtyEditForm.get('balQty').value;
    var dispatchQty = this.qtyEditForm.get('dispatchQty').value;

    ///// CHECK DISPATCH QTY IS VALID
    if (balQty < dispatchQty) {
      this.toastr.warning('Invalid Dispatch Qty !!!');
      return;
    } else {
      var autoId = this.qtyEditForm.get('autoId').value;

      var dipatchLine = this.dispatchGrid.data.filter((details) => {
        return details.autoId == autoId;
      });

      var newBalQty = balQty - dispatchQty;

      //// EXISTING LINE UPDATE QTY
      if (dipatchLine.length > 0) {
        this.pendDispatchGrid.updateCell(true, autoId, 'status');
        this.dispatchGrid.updateCell(dispatchQty, autoId, 'dispatchedQty');
        this.dispatchGrid.updateCell(newBalQty, autoId, 'balQty');
        // return;
      } else {
        this.pendDispatchGrid.updateCell(true, autoId, 'status');
        /// INSERT NEW DISPATCH LINE
        var obj = {
          autoId: autoId,
          orderRef: this.qtyEditForm.get('orderRef').value,
          deliveryRef: this.qtyEditForm.get('deliveryRef').value,
          sOItemId: this.qtyEditForm.get('soItemId').value,
          sODelivDtId: this.qtyEditForm.get('soDelivDtId').value,
          articleName: this.qtyEditForm.get('article').value,
          color: this.qtyEditForm.get('color').value,
          size: this.qtyEditForm.get('size').value,
          prodQty: this.qtyEditForm.get('prodQty').value,
          lastDispQty: this.qtyEditForm.get('lastDispQty').value,
          balQty: newBalQty,
          dispatchedQty: dispatchQty,
        };
        this.dispatchGrid.addRow(obj);
      }
      this.qtyEditForm.reset();
    }
  }

  clearDipatchQtyForm() {
    this.qtyEditForm.reset();
  }

  /////// SAVE DISPATCH NOTE
  saveDispatchNote() {
    if(this.saveButton == true) {
    //// CHECK DISPATCH DETAILS IS EXISTS
    if (!this.isDisplayMode) {
      if (this.dispatchGrid.dataLength > 0) {
        // var user: User = JSON.parse(localStorage.getItem('user'));
        var dispatchList = [];

        var DispHeader = {
          dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
          customerId: this.dispatchForm.get('customer').value[0],
          cusLocationId: this.dispatchForm.get('cusLocation').value[0],
          dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
          reason:
            this.dispatchForm.get('reason').value == undefined
              ? ''
              : this.dispatchForm.get('reason').value.trim(),
          locationId: this.user.locationId,
          createUserId: this.user.userId,
        };

        var obj = {
          DispatchHeader: DispHeader,
        };
        dispatchList.push(obj);

        ////--------=========== DISPATCH DETAILS =======================---------
        var itemRows = this.dispatchGrid.data;
        itemRows.forEach((items) => {
          var itemdata = {
            sOItemId: items.sOItemId,
            sODelivDtId: items.sODelivDtId,
            producedQty: items.prodQty,
            dispatchedQty: items.dispatchedQty,
            balDispatchQty: items.balQty,
          };
          dispatchList.push(itemdata);
        });

        // console.log(dispatchList);
        this.salesOrderServices.saveDispatchDetails(dispatchList).subscribe((result) => {
            if (result['result'] == 1) {
              //console.log(result);
              this.toastr.success('Dispatch save Successfully !!!');
              this.pendDispatchList = [];
              this.dispatchForm.get('autoId').setValue(result['refNumId']);
              this.dispatchForm.get('dispatchNo').setValue(result['refNum']);
              this.loadDipatchDetails();
            } else {
              this.toastr.warning(
                'Contact Admin. Error No:- ' + result['result'].toString()
              );
            }
          });
      } else {
        this.toastr.warning('Dispatch details is required !!!');
      }
    } else {
      this.toastr.warning('Dispatch Note already Saved !!!');
    }
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  cancelDispatchNote() {
    if(this.cancelButton == true) {
    if (this.dispatchForm.get('autoId').value > 0) {
      var obj = {
        autoId: this.dispatchForm.get('autoId').value,
        createUserId: this.user.userId,
      };

      this.salesOrderServices.cancelDispatchDetails(obj).subscribe((result) => {
        if (result == 1) {
          this.isActive = false;
          this.dispatchStatus = 'Cancel Note';
          this.toastr.success('Dispatch Note Cancel Successfully !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    }
  } else {
    this.toastr.error('Cancel Permission denied !!!');
  }
  }

  refreshControls() {
    var date: Date = new Date(Date.now());

    this.dispatchForm.get('autoId').reset();
    this.dispatchForm.get('customer').reset();
    this.dispatchForm.get('cusLocation').reset();
    this.dispatchForm.get('fromSite').reset();
    this.dispatchForm.get('reason').reset();
    this.dispatchForm.get('transDate').setValue(date);

    this.qtyEditForm.reset();
    this.pendDispatchList = [];
    this.dispatchList = [];
    this.isDisplayMode = false;
    this.isCustomer = false;
    this.isFromSite = false;
    this.isActive = false;
    this.dispatchStatus = '';
    this.enableControls();
    this.getDispatchNo();
  }

  /// LOADS DISPATCH NOTE DETAILS
  loadDipatchDetails() {
    this.isDisplayMode = true;
    var dispatchDt = [];
    var dispatchNo = this.dispatchForm.get('dispatchNo').value.trim();

    console.log(this.isDisplayMode);
    this.salesOrderServices.getDispatchDetails(dispatchNo).subscribe(
      (result) => {
        if (result.length > 0) {
          // console.log(result);
          ////------=========== LOADS HEADER ===========-------------------
          var transDate: Date = new Date(
            this.datePipe.transform(result[0]['transDate'], 'yyyy-MM-dd')
          );

          if (result[0]['isActive'] == false) {
            this.isActive = false;
            this.dispatchStatus = 'Cancel Note';
          } else {
            this.isActive = true;
            this.dispatchStatus = 'Active Note';
          }

          this.cusLocId = result[0]['cusLocationId'];
          this.dispatchForm.get('autoId').setValue(result[0]['autoId']);
          this.customer.setSelectedItem(result[0]['customerId']);
          this.cusLoc.setSelectedItem(result[0]['cusLocationId']);
          this.fromSites.setSelectedItem(result[0]['dispatchSiteId']);
          // this.dispatchForm.get('customer').setValue(result[0]['customerId']);
          // this.dispatchForm.get('cusLocation').setValue(result[0]['cusLocationId']);
          // this.dispatchForm.get('fromSite').setValue(result[0]['dispatchSiteId']);
          this.dispatchForm.get('reason').setValue(result[0]['reason']);
          this.dispatchForm.get('transDate').setValue(transDate);

          for (let index = 0; index < result.length; index++) {
            var obj = {
              autoId: result[0]['sODelivDtId'],
              orderRef: result[0]['orderRef'],
              deliveryRef: result[0]['deliveryRef'],
              sOItemId: result[0]['sOItemId'],
              sODelivDtId: result[0]['sODelivDtId'],
              articleName: result[0]['articleName'],
              color: result[0]['color'],
              size: result[0]['size'],
              prodQty: result[0]['producedQty'],
              lastDispQty: 0,
              balQty: result[0]['balDispatchQty'],
              dispatchedQty: result[0]['dispatchedQty'],
            };
            dispatchDt.push(obj);
          }
          this.dispatchList = dispatchDt;
        }
      },
      (err) => console.error(err),
      () => {
        this.setComboValues();
        this.disableControls();
      }
    );
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setComboValues() {
    setTimeout(() => {
      // console.log(this.cusLocId);
      this.cusLoc.setSelectedItem(this.cusLocId, true);
      this.cusLoc.disabled = true;
    }, 1000);
  }

  /// PROD DISPATCH CONFIRMATION DIALOG
  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;
    // console.log(cellId);
    this.dialog.open();
  }

  disableControls() {
    /////// disabled controls
    this.cusLoc.disabled = true;
    this.customer.disabled = true;
    this.fromSites.disabled = true;
    this.dispatchForm.get('reason').disable();
  }

  enableControls() {
    /////// ENABLE controls
    this.cusLoc.disabled = false;
    this.customer.disabled = false;
    this.fromSites.disabled = false;
    this.dispatchForm.get('reason').enable();
  }

  //// DELETE DISPATCH LINE
  public onDialogOKSelected(event) {
    event.dialog.close();
    console.log(this.rowId);

    if (this.rowId > 0) {
      /// ADJUST THE PENDING DISPATCH STATUS
      this.pendDispatchGrid.updateCell(false, this.rowId, 'status');

      //// DELETE DISPATCH ITEM
      this.dispatchGrid.deleteRow(this.rowId);
    }
  }

  printDispatchNote() {
    if(this.printButton == true) {
    // this.router.navigate(['/boldreport']);
    var obj = {
      dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
      reportName: "DispatchNoteFormat"
    }
    /// STORE OBJECT IN LOCAL STORAGE
    localStorage.setItem('params', JSON.stringify(obj));
    window.open('/boldreport', '_blank');
  } else {
    this.toastr.error('Print Permission denied !!!');
  }
  }

}
