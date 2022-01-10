import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IComboSelectionChangeEventArgs,
  IgxColumnComponent,
  IgxComboComponent,
  IgxDialogComponent,
  IgxGridComponent
} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-job-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.css'],
})
export class JobCreationComponent implements OnInit {
  jobHeaderForm: FormGroup;
  jobCardForm: FormGroup;
  jobListForm: FormGroup;
  jobCardList: any;
  user: User;
  pendItems: any[];
  articleList: any[];
  colorList: any[];
  sizeList: any[];
  customerList: CustomerHd[];
  customerDtList: CustomerLoc[];
  pendOrderList: any[];
  jobOrderList: any[];
  isInvalid: boolean = false;
  btnStatus: string = '';
  rowId: number = 0;
  combinationList: any[];
  totQty: number = 0;
  planQty: number = 0;
  showCombin: boolean = true;
  showDeliLoc: boolean = true;
  showCustomer: boolean = true;
  showArticle: boolean = true;
  showColor: boolean = true;
  showSize: boolean = true;
  selectedCusLoc: number;
  isFPOCreated: boolean = false;
  saveButton: boolean = false;
  delivLocation: number = 0;
  isDisplayMode: boolean = false;
  printButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    //timezone: 'UTC+0',
  };
  public formatDateOptions = this.dateOptions;

  @ViewChild('pendOrderGrid', { static: true })
  public pendOrderGrid: IgxGridComponent;
  @ViewChild('JobGrid', { read: IgxGridComponent, static: true })
  public JobGrid: IgxGridComponent;
  @ViewChild('jobListGrid', { static: true })
  public jobListGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;

  @ViewChild('cmbarticle', { read: IgxComboComponent })
  public cmbarticle: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;
  @ViewChild('cmbcustomer', { read: IgxComboComponent })
  public cmbcustomer: IgxComboComponent;
  @ViewChild('cmbcusDelLoc', { read: IgxComboComponent })
  public cmbcusDelLoc: IgxComboComponent;
  @ViewChild('cmbcombination', { read: IgxComboComponent })
  public cmbcombination: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getJobRefNo();
    this.loadCustomer();
    // this.loadLocation();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 157).length > 0) {
        this.saveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 171).length > 0) {
        this.printButton = true;
      }
    }

    this.jobHeaderForm = this.fb.group({
      headerId: [0],
      userId: this.user.userId,
      jobNo: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(30)]],
      customerId: ['', Validators.required],
      articleId: ['', Validators.required],
      customer: [{ value: '', disabled: true }],
      article: [{ value: '', disabled: true }],
      combinId: ['', Validators.required],
      description: [{ value: '', disabled: true }],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      color: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      customerLoc: [{ value: '', disabled: true }],
      combination: [{ value: '', disabled: true }],
      jobDate: [{ value: date, disabled: true }],
      planDate: ['', Validators.required],
      customerDtId: ['', Validators.required],
      totQty: [{ value: 0, disabled: true }],
      planQty: [{ value: 0, disabled: true }],
    });

    this.jobCardForm = this.fb.group({
      customerRef: [{ value: '', disabled: true }],
      deliveryDate: [{ value: '', disabled: true }],
      deliveryRef: [{ value: '', disabled: true }],
      orderRef: [{ value: '', disabled: true }],
      soDelivDtId: [{ value: '', disabled: true }],
      soItemDtId: [{ value: '', disabled: true }],
      pjobQty: [{ value: 0, disabled: true }],
      orderQty: [{ value: 0, disabled: true }],
      planQty: [{ value: 0, disabled: true }],
      balQty: [{ value: 0, disabled: true }],
      jobQty: ['', Validators.required],
    });

    this.jobListForm = this.fb.group({
      customerPO: ['', [Validators.maxLength(15)]],
    })
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

  loadCustomer() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
    });
  }

  /// customer SELECT CHANGE EVENT
  onCustomerChange(event) {
    for (const item of event.added) {
      //console.log(item);
      this.loadCustomerDt(item);
    }
  }

  //// LOADS CUSTOMER DELIVERY LOCATION
  loadCustomerDt(customerId) {
    this.masterServices.getCustomerLocation(customerId).subscribe(
      (customerDt) => {
        this.customerDtList = customerDt;
        //this.cmbcusDelLoc.open();
      },
      (err) => console.error(err),
      () => {
        //this.cmbcusDelLoc.setSelectedItem(1,true);
        // console.log('observable complete');
      }
    );
  }

  getJobRefNo() {
    this.jobHeaderForm.get('jobNo').setValue('');
    this.salesOrderServices.getRefNumber('JobNo').subscribe((res) => {
      //console.log(refNo);
      this.jobHeaderForm.get('jobNo').setValue(res.refNo.toString());
    });
  }

  clearGridView(event) {
    this.pendOrderList = [];
  }

  getCostCombination(event) {
    this.combinationList = [];
    this.pendOrderList = [];
    this.jobHeaderForm.get('combinId').setValue('');

    for (const item of event.added) {
      //console.log(event);
      var obj = {
        customerId: this.jobHeaderForm.get('customerId').value[0],
        articleId: this.jobHeaderForm.get('articleId').value[0],
        colorId: this.jobHeaderForm.get('colorId').value[0],
        sizeId: item,
      };

      // console.log(obj);
      this.salesOrderServices.getCostComination(obj).subscribe((result) => {
        this.combinationList = result;
      });
    }
  }

  // loadLocation() {
  //   var user: User = JSON.parse(localStorage.getItem('user'));

  //   var obj = {
  //     SysModuleId: user.moduleId,
  //     UserId: user.userId,
  //   };

  //   this.registerServices.getUserLocation(obj).subscribe((locList) => {
  //     //console.log(locList);
  //     this.locationList = locList;
  //   });
  // }

  loadPendArticle(event) {
    this.pendOrderList = [];

    for (const item of event.added) {
      this.salesOrderServices.getPendOrderItems(item).subscribe((itemList) => {
        this.pendItems = itemList;
        /// loads unique article list
        //console.log(this.pendItems);
        this.articleList = this.uniqueByKey(itemList, 'articleId');
      });
    }
  }

  loadPendColor(event) {
    this.colorList = [];
    this.pendOrderList = [];
    this.jobHeaderForm.get('colorId').setValue('');
    this.jobHeaderForm.get('sizeId').setValue('');
    this.jobHeaderForm.get('description').setValue('');

    for (const item of event.added) {
      //console.log(this.pendItems);
      var colorList = this.pendItems.filter((x) => x.articleId == item);
      this.jobHeaderForm
        .get('description')
        .setValue(colorList[0]['description1']);
      /// loads unique COLOR list
      this.colorList = this.uniqueByKey(colorList, 'colorId');
      //console.log(colorList[0]["description1"]);
    }
  }

  loadPendSize(event) {
    this.sizeList = [];
    this.pendOrderList = [];
    this.jobHeaderForm.get('sizeId').setValue('');
    for (const item of event.added) {
      var sizeList = this.pendItems.filter((x) => x.articleId == item);
      /// loads unique SIZE list
      this.sizeList = this.uniqueByKey(sizeList, 'sizeId');
      //console.log(this.sizeList);
    }
  }

  uniqueByKey(array, key) {
    return [...new Map(array.map((x) => [x[key], x])).values()];
  }

  loadPendDelivOrders() {
    this.pendOrderList = [];
    // console.log(this.jobHeaderForm.get('headerId').value);
    if (this.jobHeaderForm.get('headerId').value == 0) {
      var obj = {
        customerId: this.jobHeaderForm.get('customerId').value[0],
        combinId: this.jobHeaderForm.get('combinId').value[0],
        articleId: this.jobHeaderForm.get('articleId').value[0],
        colorId: this.jobHeaderForm.get('colorId').value[0],
        sizeId: this.jobHeaderForm.get('sizeId').value[0],
      };
    } else {
      var obj = {
        customerId: this.jobHeaderForm.get('customerId').value,
        combinId: this.jobHeaderForm.get('combinId').value,
        articleId: this.jobHeaderForm.get('articleId').value,
        colorId: this.jobHeaderForm.get('colorId').value,
        sizeId: this.jobHeaderForm.get('sizeId').value,
      };
    }

    // console.log(obj);
    this.salesOrderServices.getPendDelivOrder(obj).subscribe((orderList) => {
      this.pendOrderList = orderList;
    });
  }

  addJobCardRow() {
    if (this.jobCardForm.get('soItemDtId').value > 0) {
      //// CALCULATE BAL QTY
      var balQty =
        this.jobCardForm.get('orderQty').value -
        (this.jobCardForm.get('pjobQty').value +
          this.jobCardForm.get('jobQty').value);

      // console.log(this.jobCardForm.get('orderQty').value);
      // console.log(this.jobCardForm.get('pjobQty').value);
      // console.log(this.jobCardForm.get('jobQty').value);
      /// CHECK BALANCE QTY
      if (balQty < 0) {
        this.toastr.warning('Invalid Job Qty !!!');
      } else {
        var planQty = this.jobCardForm.get('planQty').value;
        var soDelivDtId = this.jobCardForm.get('soDelivDtId').value;
        var totJobQty =
          this.jobCardForm.get('pjobQty').value +
          this.jobCardForm.get('jobQty').value;

        //// COMMENTS ON 2022-01-07 NO NEED TO CHECK PLAN QTY SINCE AFTER PLANNING CAN NOT EDIT THE ROW DATA
        //// CHECK FPO IS ATTACHED
        // if (planQty > 0) {
        //   // JOB QTY CAN NOT EXCEED PLAN QTY
        //   if (totJobQty > planQty) {
        //     this.toastr.warning("Job Qty can't exceed plan Qty");
        //     return;
        //   }
        // }

        const selectedRowData = this.JobGrid.data.filter((record) => {
          return record.soDelivDtId == soDelivDtId;
        });

        ///ADJUEST THE PENDING DELIVERY ORDER
        this.adjustPendDelivOrders('');

        //// UPDATE STATUS OF THE PEND DELIVERY TABLE
        this.pendOrderGrid.updateCell(true, soDelivDtId, 'status');

        //// IF ITEM IS EXISTS UPDATE BAL AND JOB QTY
        if (selectedRowData.length > 0) {
          this.toastr.warning('Item exists in job card !!!');
          // this.JobGrid.updateCell(balQty, soDelivDtId, 'balQty');
          // this.JobGrid.updateCell(
          //   this.jobCardForm.get('jobQty').value,
          //   soDelivDtId,
          //   'jobQty'
          // );
        } else {
          //// ADD ROW TO JOB TABLE
          var obj = {
            customerRef: this.jobCardForm.get('customerRef').value,
            deliveryDate: this.jobCardForm.get('deliveryDate').value,
            deliveryRef: this.jobCardForm.get('deliveryRef').value,
            pjobQty: this.jobCardForm.get('pjobQty').value,
            orderQty: this.jobCardForm.get('orderQty').value,
            planQty: this.jobCardForm.get('planQty').value,
            balQty: balQty,
            jobQty: this.jobCardForm.get('jobQty').value,
            orderRef: this.jobCardForm.get('orderRef').value,
            soDelivDtId: soDelivDtId,
            soItemDtId: this.jobCardForm.get('soItemDtId').value,
          };
          this.JobGrid.addRow(obj);
        }

        this.calculateSum();
        this.jobCardForm.reset();
      }
    } else {
      this.toastr.warning('Item must be selected !!!');
    }
  }

  /// MOVE DELIVERY ORDER TO JOB FORM
  onAddJobOrderItem(selectedRowData) {
    // console.log(selectedRowData);
    var orderQty = selectedRowData[0]['orderQty'];
    var delDate: Date = new Date(selectedRowData[0]['deliveryDate']);
    var prvJobQty = 0,
      balQty = 0,
      jobQty = 0;

    /// FROM PENDING DELIVERY ORDES
    prvJobQty = selectedRowData[0]['jobQty'];
    jobQty = 0;
    balQty = orderQty - (prvJobQty + jobQty);

    this.jobCardForm
      .get('soItemDtId')
      .setValue(selectedRowData[0]['soItemDtId']);
    this.jobCardForm
      .get('soDelivDtId')
      .setValue(selectedRowData[0]['soDelivDtId']);
    this.jobCardForm.get('orderRef').setValue(selectedRowData[0]['orderRef']);
    this.jobCardForm
      .get('customerRef')
      .setValue(selectedRowData[0]['customerRef']);
    this.jobCardForm
      .get('deliveryRef')
      .setValue(selectedRowData[0]['deliveryRef']);
    this.jobCardForm.get('deliveryDate').setValue(delDate);
    this.jobCardForm.get('balQty').setValue(balQty);
    this.jobCardForm.get('planQty').setValue(selectedRowData[0]['planQty']);
    this.jobCardForm.get('pjobQty').setValue(prvJobQty);
    this.jobCardForm.get('orderQty').setValue(selectedRowData[0]['orderQty']);
  }

  /// PENDING DELIVERY ORDER EDIT
  onPendingOrderDown(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.pendOrderGrid.data.filter((record) => {
      return record.soDelivDtId == ids;
    });

    /// CHECK item IS EXISTS IN THE JOB CARD
    var jobCardRows = this.JobGrid.data.filter((details) => {
      return details.soDelivDtId == ids;
    });

    if (jobCardRows.length > 0) {
      this.toastr.warning('Item is exists in job card');
      this.pendOrderGrid.updateCell(true, ids, 'status');
      return;
    } else {
      if (selectedRowData.length > 0) {
        this.onAddJobOrderItem(selectedRowData);
      }
    }
  }

  //// JOB CARD EDIT EVENT
  // onJobCardEdit(event, cellId) {
  //   this.jobCardForm.reset();
  //   //console.log(cellId);
  //   const ids = cellId.rowID;
  //   const selectedRowData = this.JobGrid.data.filter((record) => {
  //     return record.soDelivDtId == ids;
  //   });

  //   if (selectedRowData.length > 0) {
  //     this.onAddJobOrderItem(selectedRowData, 'J');
  //   }
  // }

  //// CHECK JOB QTY WITH ORDER QTY
  // editDone(event) {
  //   var jobQty = event.newValue;
  //   var orderQty = event.rowData['orderQty'];

  //   if (jobQty > orderQty) {
  //     this.isInvalid = true;
  //     this.toastr.warning('Invalid Job Qty !!!');
  //   }
  // }

  // rowEditDone(event) {
  //   var soDelivDtId = event.rowData['soDelivDtId'];

  //   /// UPDATE ZERO TO INVALID JOB QTY
  //   if (this.isInvalid == true) {
  //     this.isInvalid = false;
  //     this.JobGrid.updateCell(0, soDelivDtId, 'jobQty');
  //   }

  //   ///update balance qty in grid
  //   var balQty =
  //     event.rowData['orderQty'] -
  //     (event.rowData['pjobQty'] + event.rowData['jobQty']);
  //   this.JobGrid.updateCell(balQty, soDelivDtId, 'balQty');

  //   /// update balance and total qty in header section
  //   this.calculateSum();
  // }

  //// CALCULATE SUM OF THE JOB QTY AND PLAN QTY
  calculateSum() {
    this.totQty = 0;
    this.planQty = 0;
    const allRows = this.JobGrid.data;
    // console.log(this.JobGrid.data);

    allRows.forEach((element) => {
      this.totQty = this.totQty + element['jobQty'];
      this.planQty = this.planQty + element['planQty'];
    });

    this.jobHeaderForm.get('totQty').setValue(this.totQty);
    this.jobHeaderForm.get('planQty').setValue(this.planQty);
  }

  /// JOB DELETE CONFIRMATION DIALOG
  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;
    // console.log(cellId);
    this.dialog.open();
  }

  //// DELETE JOB ITEM LINE
  public onDialogOKSelected(event) {
    event.dialog.close();
    var isDelete = false;
    // console.log(this.rowId);

    if (this.rowId > 0) {
      const selectedRowData = this.JobGrid.data.filter((record) => {
        return record.soDelivDtId == this.rowId; // && record.planQty > 0;
      });

      ///// IF IT IS A EXISTING JOB CARD CHECK THE PALN QTY TO MAKE SURE JOB IS PLACED OR NOT 
     if (this.isDisplayMode == true ) {
         //// CHECK FPO IS EXISTS IF SO CAN'T DELETE THE JOB LINE
        var PlanQty = selectedRowData[0]["planQty"];

        if (PlanQty > 0 ){
          this.toastr.warning('Delete Fail. FPO already placed !!!');          
          return;
        } else {
          isDelete = true;
        }
     } else {
        isDelete = true;
     }   

     if (isDelete == true) {
      if (selectedRowData.length > 0) {
        /// ADJUST THE PENDING DELIVERY ORDERS
        this.adjustPendDelivOrders(selectedRowData);
        //// DELETE JOB ITEM AND CALCULATE SUM
        this.JobGrid.deleteRow(this.rowId);
        this.calculateSum();
        //console.log(this.JobGrid.data);      
    }
  }
}
}

  //// WHEN DELETE JOB ITEM ADJUST PENDING ORDERS
  adjustPendDelivOrders(selectedRowData) {
    var njobQty = 0,
      jobQty = 0,
      soDelivDtId = 0,
      obj = {},
      pjobQty = 0;
    //// get data from edit job card
    if (selectedRowData == '') {
      jobQty = this.jobCardForm.get('jobQty').value;
      soDelivDtId = this.jobCardForm.get('soDelivDtId').value;
      pjobQty = this.jobCardForm.get('pjobQty').value;
    } else {
      //// get from when delete the job card
      jobQty = selectedRowData[0]['jobQty'];
      soDelivDtId = selectedRowData[0]['soDelivDtId'];
      pjobQty = selectedRowData[0]['pjobQty'];
    }

    //// INSERT OR UPDATE RECORD IN PENDING DELIVERY ORDER
    const pendRowData = this.pendOrderGrid.data.filter((record) => {
      return record.soDelivDtId == soDelivDtId;
    });

    if (pendRowData.length > 0) {
      var totJobQty = pendRowData[0]['jobQty'];

      if (selectedRowData == '') {
        njobQty = pjobQty + jobQty; /// edit qty
      } else {
        njobQty = totJobQty - jobQty; /// delete qty
      }

      this.pendOrderGrid.updateCell(njobQty, soDelivDtId, 'jobQty');
      this.pendOrderGrid.updateCell(false, soDelivDtId, 'status');
    } else {
      //// ADD ROW TO PENDING DELIVERY TABLE

      if (selectedRowData == '') {
        obj = {
          customerRef: this.jobCardForm.get('customerRef').value,
          deliveryDate: this.jobCardForm.get('deliveryDate').value,
          deliveryRef: this.jobCardForm.get('deliveryRef').value,
          pjobQty: this.jobCardForm.get('pjobQty').value,
          orderQty: this.jobCardForm.get('orderQty').value,
          planQty: this.jobCardForm.get('planQty').value,
          jobQty: this.jobCardForm.get('jobQty').value,
          orderRef: this.jobCardForm.get('orderRef').value,
          soDelivDtId: soDelivDtId,
          soItemDtId: this.jobCardForm.get('soItemDtId').value,
        };
      } else {
        obj = {
          customerRef: selectedRowData[0]['customerRef'],
          deliveryDate: selectedRowData[0]['deliveryDate'],
          deliveryRef: selectedRowData[0]['deliveryRef'],
          orderQty: selectedRowData[0]['orderQty'],
          planQty: selectedRowData[0]['planQty'],
          jobQty: selectedRowData[0]['pjobQty'],
          orderRef: selectedRowData[0]['orderRef'],
          soDelivDtId: soDelivDtId,
          soItemDtId: selectedRowData[0]['soItemDtId'],
        };
      }
      this.pendOrderGrid.addRow(obj);
    }
  }

   //// save dialog confirmation to save
   onSaveSelected(event) {
    this.savedialog.close();
    this.saveJobCard();
  }

  saveJobCard() {
    if(this.saveButton == true) {
    if (this.validateJobCard()) {
      // var user: User = JSON.parse(localStorage.getItem('user'));
      var jobCardList = [],
        customerId = 0,
        articleId = 0,
        colorId = 0,
        sizeId = 0,
        combinId = 0;

      //console.log(this.jobHeaderForm.get('customerId').value);
      ////--------=========== JOB CARD HEADER =======================---------
      if (this.jobHeaderForm.get('headerId').value > 0) {
        ///// IF IT IS A EXISTING JOB CARD
        customerId = this.jobHeaderForm.get('customerId').value;
        articleId = this.jobHeaderForm.get('articleId').value;
        colorId = this.jobHeaderForm.get('colorId').value;
        sizeId = this.jobHeaderForm.get('sizeId').value;
        combinId = this.jobHeaderForm.get('combinId').value;
        //delivLocationId = this.jobHeaderForm.get('customerDtId').value;
      } else {
        ///// IF IT IS A NEW JOB CARD
        customerId = this.jobHeaderForm.get('customerId').value[0];
        articleId = this.jobHeaderForm.get('articleId').value[0];
        colorId = this.jobHeaderForm.get('colorId').value[0];
        sizeId = this.jobHeaderForm.get('sizeId').value[0];
        combinId = this.jobHeaderForm.get('combinId').value[0];
        //delivLocationId = this.jobHeaderForm.get('customerDtId').value[0];
      }

      var JobHeader = {
        jobNo: this.jobHeaderForm.get('jobNo').value,
        customerId: customerId,
        articleId: articleId,
        colorId: colorId,
        sizeId: sizeId,
        combinId: combinId,
        delivLocationId: this.jobHeaderForm.get('customerDtId').value[0],
        totQty: this.jobHeaderForm.get('totQty').value,
        planQty: this.jobHeaderForm.get('planQty').value,
        locationId: this.user.locationId,
        createUserId: this.user.userId,
        planDate: this.datePipe.transform(
          this.jobHeaderForm.get('planDate').value,
          'yyyy-MM-dd'
        ),
      };

      var obj = {
        jobHeader: JobHeader,
      };
      jobCardList.push(obj);

      ////--------=========== JOB CARD ORDERS =======================---------
      var itemRows = this.JobGrid.data;
      itemRows.forEach((items) => {
        var itemdata = {
          jobHeaderId: this.jobHeaderForm.get('headerId').value,
          soItemDtId: items.soItemDtId,
          soDelivDtId: items.soDelivDtId,
          orderQty: items.orderQty,
          jobQty: items.jobQty,
        };
        jobCardList.push(itemdata);
      });

      // console.log(jobCardList);
      // // //console.log(JSON.stringify(menuList));

      this.salesOrderServices.saveJobCard(jobCardList).subscribe((result) => {
        if (result['result'] == 1) {
          //console.log(result);
          this.toastr.success('Job Card save Successfully !!!');
          this.jobHeaderForm.get('headerId').setValue(result['refNumId']);
          this.jobHeaderForm.get('jobNo').setValue(result['refNum']);          
          this.refreshJobControls();
          this.disableControls();
          this.loadJobCardDetails();
        } else if (result['result'] == -1) {
          this.toastr.success('Job Card update Successfully !!!');          
          this.refreshJobControls();
          this.disableControls();
          this.loadJobCardDetails();
        } else {
          this.toastr.warning(
            'Contact Admin. Error No:- ' + result['result'].toString()
          );
        }
      });
    }
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  ///// VALIDATION BEFORE SAVE JOB CARD
  validateJobCard() {
    if (this.isFPOCreated == false) {
      if (this.JobGrid.dataLength > 0) {
        return true;
      } else {
        this.toastr.info('Job Card details are required !!!');
        return false;
      }
    } else {
      this.toastr.info('FPO already created !!!');
      return false;
    }
  }

  // handleDataPreloadEvent() {
  //   console.log("here");
  //   this.cmbcusDelLoc.setSelectedItem(this.selectedCusLoc,true);
  //   this.cmbcusDelLoc.triggerCheck();
  // }

  loadJobCardDetails() {
    (this.totQty = 0), (this.planQty = 0);
    var jobNo = this.jobHeaderForm.get('jobNo').value;
    var jobCardList = [];
    this.isDisplayMode = true;

    this.salesOrderServices.getJobCardDetails(jobNo).subscribe(
      (jobCardDT) => {
        //console.log(jobCardDT);
        if (jobCardDT.length > 0) {
          ////========= SET JOB CARD HEDER ================
          /// LOADS CUSTOMER LOCATION BASED ON CUSTOMER
          this.loadCustomerDt(jobCardDT[0]['customerId']);

          var jobDate: Date = new Date(
            this.datePipe.transform(jobCardDT[0]['jobDate'], 'yyyy-MM-dd')
          );

          var planDate: Date = new Date(
            this.datePipe.transform(jobCardDT[0]['planDate'], 'yyyy-MM-dd')
          );

          this.jobHeaderForm.get('jobDate').setValue(jobDate);
          this.jobHeaderForm.get('planDate').setValue(planDate);

          this.jobHeaderForm.get('customer').setValue(jobCardDT[0]['customer']);
          this.jobHeaderForm
            .get('article')
            .setValue(jobCardDT[0]['articleName']);
          this.jobHeaderForm.get('color').setValue(jobCardDT[0]['color']);
          this.jobHeaderForm.get('size').setValue(jobCardDT[0]['size']);
          this.jobHeaderForm
            .get('description')
            .setValue(jobCardDT[0]['description1']);
          this.jobHeaderForm
            .get('customerLoc')
            .setValue(jobCardDT[0]['customerLoc']);
          this.jobHeaderForm
            .get('combination')
            .setValue(jobCardDT[0]['combination']);
          //this.selectedCusLoc = [jobCardDT[index]['delivLocationId']];

          this.jobHeaderForm
            .get('customerId')
            .setValue(jobCardDT[0]['customerId']);
          this.jobHeaderForm
            .get('articleId')
            .setValue(jobCardDT[0]['articleId']);
          this.jobHeaderForm.get('colorId').setValue(jobCardDT[0]['colorId']);
          this.jobHeaderForm.get('sizeId').setValue(jobCardDT[0]['sizeId']);
          this.jobHeaderForm.get('combinId').setValue(jobCardDT[0]['combinId']);

          //// SET CUSTOMER LOACTION
          this.delivLocation = jobCardDT[0]['delivLocationId'];
          this.cmbcusDelLoc.setSelectedItem(
            jobCardDT[0]['delivLocationId'],
            true
          );

          this.jobHeaderForm
            .get('headerId')
            .setValue(jobCardDT[0]['jobHeaderId']);

          /// LOADS PENDING DELIVERY ITEMS
          this.loadPendDelivOrders();

          /// LOADS JOB CARD GRID
          for (let index = 0; index < jobCardDT.length; index++) {
            var balQty =
              jobCardDT[index]['orderQty'] - jobCardDT[index]['jobQty'];

            var obj = {
              customerRef: jobCardDT[index]['customerRef'],
              deliveryDate: jobCardDT[index]['deliveryDate'],
              deliveryRef: jobCardDT[index]['deliveryRef'],
              pjobQty: jobCardDT[index]['oldJobQty'],
              orderQty: jobCardDT[index]['orderQty'],
              planQty: jobCardDT[index]['planQty'],
              balQty: balQty,
              jobQty: jobCardDT[index]['jobQty'],
              orderRef: jobCardDT[index]['orderRef'],
              soDelivDtId: jobCardDT[index]['soDelivDtId'],
              soItemDtId: jobCardDT[index]['soItemDtId'],
            };

            this.totQty = this.totQty + jobCardDT[index]['jobQty'];
            this.planQty = this.planQty + jobCardDT[index]['planQty'];

            if (this.planQty > 0) this.isFPOCreated = true;

            jobCardList.push(obj);
          }

          this.jobOrderList = jobCardList;
          this.jobHeaderForm.get('totQty').setValue(this.totQty);
          this.jobHeaderForm.get('planQty').setValue(this.planQty);
        }
      },
      (err) => console.error(err),
      () => {
        this.setComboValues();
      }
    );
  }

  setComboValues() {
    setTimeout(() => {
      //console.log("pending");
      this.cmbcusDelLoc.setSelectedItem(this.delivLocation, true);
    }, 1000);
  }

  refreshJobControls() {
    this.isDisplayMode = false;
    this.pendOrderList = [];
    this.jobOrderList = [];
    this.articleList = [];
    this.colorList = [];
    this.sizeList = [];
    this.combinationList = [];
    this.customerDtList = [];

    var date: Date = new Date(Date.now());
    this.jobHeaderForm.get('headerId').setValue(0);
    this.jobHeaderForm.get('jobDate').setValue(date);
    this.jobHeaderForm.get('userId').setValue(this.user.userId);
    this.jobHeaderForm.get('customerId').setValue(0);
    this.jobHeaderForm.get('articleId').setValue('');
    this.jobHeaderForm.get('combinId').setValue('');
    this.jobHeaderForm.get('colorId').setValue('');
    this.jobHeaderForm.get('sizeId').setValue('');
    this.jobHeaderForm.get('planDate').setValue('');
    this.jobHeaderForm.get('customerDtId').setValue('');

    this.jobHeaderForm.get('customer').setValue('');
    this.jobHeaderForm.get('article').setValue('');
    this.jobHeaderForm.get('description').setValue('');
    this.jobHeaderForm.get('color').setValue('');
    this.jobHeaderForm.get('size').setValue('');
    this.jobHeaderForm.get('customerLoc').setValue('');
    this.jobHeaderForm.get('combination').setValue('');
    this.jobHeaderForm.get('totQty').setValue(0);
    this.jobHeaderForm.get('planQty').setValue(0);
    this.isFPOCreated = false;
  }

  clearJobCardControls() {
    // this.jobHeaderForm.reset();
    this.refreshJobControls();
    this.clearJobEditControls();
    this.getJobRefNo();
    //this.loadCustomer();
    this.enableControls();
  }

  clearJobEditControls() {
    this.jobCardForm.reset();
    this.jobCardForm.get('pjobQty').setValue(0);
    this.jobCardForm.get('orderQty').setValue(0);
    this.jobCardForm.get('planQty').setValue(0);
    this.jobCardForm.get('balQty').setValue(0);
  }

  enableControls() {
    this.showArticle = true;
    this.showColor = true;
    this.showCombin = true;
    this.showCustomer = true;
    this.showSize = true;
  }

  disableControls() {
    this.showArticle = false;
    this.showColor = false;
    this.showCombin = false;
    this.showCustomer = false;
    //this.showDeliLoc = false;
    this.showSize = false;
  }

  //// JOB NO KEY UP EVENT
  onKey(event: any) {
    if (event.keyCode != 13) {
      this.refreshJobControls();
      this.enableControls();
    } else {
      this.loadJobCardDetails();
    }
  }

  printJobCard() {
    if(this.printButton == true) {
      // this.router.navigate(['/boldreport']);
      var obj = {
        jobCardNo: this.jobHeaderForm.get('headerId').value,
        reportName: "JobDetailsFormat"
      }
      // console.log(this.jobHeaderForm.get('headerId').value);
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }

   /// FILER AND GET JOB CARD DETAILS BY CUSTOMER REF
   public filterByCusRef(term) {
    if (term != '') {
      this.salesOrderServices.getJobCardList(term).subscribe(result => {
        this.jobCardList = result
      })
    }
  }

   //// CLICK EVENT OF JOB CARD LIST GRID ROW
   onViewJobDetails(event, cellId) {
    this.refreshJobControls();
    this.disableControls();

    var headerId = cellId.rowID;
    const ItemRowData = this.jobListGrid.data.filter((record) => {
      return record.jobHeaderId == headerId;
    });

    this.jobHeaderForm.get('headerId').setValue(headerId);
    this.jobHeaderForm.get('jobNo').setValue(ItemRowData[0]["jobNo"]);

    this.loadJobCardDetails();
  }


}
