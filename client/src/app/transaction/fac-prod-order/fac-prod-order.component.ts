import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-fac-prod-order',
  templateUrl: './fac-prod-order.component.html',
  styleUrls: ['./fac-prod-order.component.css'],
})
export class FacProdOrderComponent implements OnInit {
  fpoHeaderForm: FormGroup;
  fpoDetailForm: FormGroup;
  user: User;
  pendJobList: any[];
  jobDtList: any[];
  fpoList: any[];
  totPlanQty: number = 0;
  rowId: number = 0;
  isGridDisabled: boolean = false;
  isDisplayMode: boolean = false;
  clickFPODelete: boolean = false;
  fpoStatus: string = '';

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('fpoGrid', { read: IgxGridComponent, static: true })
  public fpoGrid: IgxGridComponent;
  @ViewChild('pendJobDtGrid', { read: IgxGridComponent, static: true })
  public pendJobDtGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  @ViewChild('jobNo', { read: IgxComboComponent })
  public jobNo: IgxComboComponent;

  ////Date options
  //  public dateOptions = {
  //   format: 'yyyy-MM-dd',
  //   //timezone: 'UTC+0',
  // };
  // public formatDateOptions = this.dateOptions;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadPendingJobList();
    this.getFPORefNo();
  }

  initilizeForm() {
    //var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.fpoHeaderForm = this.fb.group({
      fpoId: [0],
      userId: this.user.userId,
      jobHeaderId: ['', [Validators.required, Validators.maxLength(30)]],
      fPONo: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required],
      statusId: [0],      
      remarks: [''],
      qty: [{ value: 0, disabled: true }],
    }, {validators: this.dateLessThan('startDate', 'endDate')});

    this.fpoDetailForm = this.fb.group({
      soDelivDtId: [0],
      soItemDtId: [0],
      deliveryRef: [{ value: '', disabled: true } ,Validators.required],
      customerId: [0],
      customer: [{ value: '', disabled: true },Validators.required],
      articleId: [0],
      articleName: [{ value: '', disabled: true },Validators.required],
      colorId: [0],
      color: [{ value: '', disabled: true },Validators.required],
      sizeId: [0],
      size: [{ value: '', disabled: true },Validators.required],
      combinId: [0],
      combination: [{ value: '', disabled: true },Validators.required],
      fpoQty: ['', Validators.required],
      prevfpoQty: [{ value: 0, disabled: true }],
      jobQty: [{ value: 0, disabled: true }],
      balQty: [{ value: 0, disabled: true }],
    });
  }

  /// VALIDATE START DATE AND END DATE 
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      // console.log(f.value);
      // console.log(t.value);

      if(f.value != "" && t.value != "") {
        if (f.value > t.value) {
          return {
            dates: 'Date Start should be less than Date End'
          };
        }
      }      
      return {};
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

  //// LOADS PENDING JOB ORDER NO LIST
  loadPendingJobList() {
    this.salesOrderServices.getFPOPendingJobs().subscribe((jobs) => {
      this.pendJobList = jobs;
    });
  }

  //// GENERATE NEW FPO NUMBER
  getFPORefNo() {
    this.fpoHeaderForm.get('fPONo').setValue('');
    var Transtype = 'FPONo';
    this.salesOrderServices.getRefNumber(Transtype).subscribe((res) => {
      //console.log(refNo);
      this.fpoHeaderForm.get('fPONo').setValue(res.refNo.toString());
    });
  }

  //// ON JOB NO SELECT CHANGED
  onJobNoSelect(event) {
    if (this.fpoHeaderForm.get('fpoId').value == 0) {
      this.jobDtList = [];
      this.fpoList = [];
      for (const item of event.added) {
        //console.log(item);
        this.loadPendingJobDetails(item);
      }
    }
  }

  /// LOADS PENDING JOB DETAILS BASED ON THE JOB NO
  loadPendingJobDetails(jobId) {
    this.salesOrderServices.getFPOPendingJobDt(jobId).subscribe((jobDt) => {
      this.jobDtList = jobDt;
    });
  }

  /// PENDING JOB ORDER LIST
  onPendingOrderDown(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.pendJobDtGrid.data.filter((record) => {
      return record.soDelivDtId == ids;
    });

    /// CHECK item IS EXISTS IN THE FPO
    var FPORows = this.fpoGrid.data.filter((details) => {
      return details.soDelivDtId == ids;
    });

    // console.log(ids);
    // console.log(this.fpoGrid.data);
    if (FPORows.length > 0) {
      this.toastr.warning('Item is exists in job card');
      return;
    } else {
      if (selectedRowData.length > 0) {
        this.onAddFPOItem(selectedRowData);
        this.pendJobDtGrid.updateCell(true, ids, 'status');
      }
    }
  }

  /// MOVE PENDING JOB ORDER TO FPO GRID
  onAddFPOItem(selectedRowData) {
    //console.log(selectedRowData);
    var obj = {
      soDelivDtId: selectedRowData[0]['soDelivDtId'],
      soItemDtId: selectedRowData[0]['soItemDtId'],
      deliveryRef: selectedRowData[0]['deliveryRef'],
      customerId: selectedRowData[0]['customerId'],
      customer: selectedRowData[0]['customer'],
      articleId: selectedRowData[0]['articleId'],
      articleName: selectedRowData[0]['articleName'],
      colorId: selectedRowData[0]['colorId'],
      color: selectedRowData[0]['color'],
      sizeId: selectedRowData[0]['sizeId'],
      size: selectedRowData[0]['size'],
      combinId: selectedRowData[0]['combinId'],
      combination: selectedRowData[0]['combination'],
      fpoQty: selectedRowData[0]['balQty'],
      prevfpoQty: selectedRowData[0]['fpoQty'],
      jobQty: selectedRowData[0]['jobQty'],
      balQty: 0,
    };
    this.fpoGrid.addRow(obj);
    this.calculateSum();
  }

  /// FPO LINE DELETE CONFIRMATION DIALOG
  openConfirmDialogLine(event, cellId) {
    this.clickFPODelete = false;
    this.rowId = cellId.rowID;
    //console.log(cellId);
    this.dialog.open();
  }

  /// FPO DELETE CONFIRMATION DIALOG
  openConfirmDialog(event) {
    if (this.fpoHeaderForm.get('fpoId').value > 0) {
      this.clickFPODelete = true;
      this.dialog.open();
    } else {
      this.toastr.success('Invalid FPO !!!');
    }
  }

  //// DELETE FPO ITEM LINE
  public onDialogOKSelected(event) {
    this.clearFPODetailControls();
    event.dialog.close();
    if (this.clickFPODelete == true) {
      this.deleteFPO();
    } else {
      if (this.rowId > 0) {
        /// UPDATE PENDING JOB ORDERS
        this.pendJobDtGrid.updateCell(false, this.rowId, 'status');
        //// DELETE FPO ITEM AND CALCULATE SUM
        this.fpoGrid.deleteRow(this.rowId);
        this.calculateSum();
      }
    }
  }

  //// UPDATE FPO QTY IN EXISTING ROW
  updateFPORow() {
    if (this.fpoDetailForm.get('soDelivDtId').value > 0) {
      var soDelivDtId = this.fpoDetailForm.get('soDelivDtId').value;
      var FPOQty = this.fpoDetailForm.get('fpoQty').value;
      var jobQty = this.fpoDetailForm.get('jobQty').value;
      var prevFPOQty = this.fpoDetailForm.get('prevfpoQty').value;
      var balQty = jobQty - prevFPOQty;
      var newBalQty = jobQty - (prevFPOQty + FPOQty);

      if (balQty < FPOQty) {
        this.toastr.warning('Invalid FPO Qty !!!');
      } else {
        this.fpoGrid.updateCell(FPOQty, soDelivDtId, 'fpoQty');
        this.fpoGrid.updateCell(newBalQty, soDelivDtId, 'balQty');
        this.calculateSum();
        this.fpoDetailForm.reset();
      }
    } else {
      this.toastr.warning('Select row to edit !!!');
    }
  }

  //// CALCULATE SUM OF THE FPO QTY
  calculateSum() {
    this.totPlanQty = 0;
    const allRows = this.fpoGrid.data;
    //console.log(this.fpoGrid.data);

    allRows.forEach((element) => {
      this.totPlanQty = this.totPlanQty + element['fpoQty'];
    });
    this.fpoHeaderForm.get('qty').setValue(this.totPlanQty);
  }

  /// CLEAR FPO DETAILS FORM
  clearFPODetailControls() {
    this.fpoDetailForm.reset();
  }

  ///LOADS FPO LINE TO FORM ONLY FPO QTY CAN BE EDITED
  onFPOEdit(event, cellId) {
    this.fpoDetailForm.reset();
    //console.log(cellId);
    const ids = cellId.rowID;
    const selectedRowData = this.fpoGrid.data.filter((record) => {
      return record.soDelivDtId == ids;
    });

    if (selectedRowData.length > 0) {
      this.fpoDetailForm
        .get('soDelivDtId')
        .setValue(selectedRowData[0]['soDelivDtId']);
      this.fpoDetailForm
        .get('soItemDtId')
        .setValue(selectedRowData[0]['soItemDtId']);
      this.fpoDetailForm
        .get('deliveryRef')
        .setValue(selectedRowData[0]['deliveryRef']);
      this.fpoDetailForm
        .get('customerId')
        .setValue(selectedRowData[0]['customerId']);
      this.fpoDetailForm
        .get('customer')
        .setValue(selectedRowData[0]['customer']);
      this.fpoDetailForm
        .get('articleId')
        .setValue(selectedRowData[0]['articleId']);
      this.fpoDetailForm
        .get('articleName')
        .setValue(selectedRowData[0]['articleName']);
      this.fpoDetailForm.get('colorId').setValue(selectedRowData[0]['colorId']);
      this.fpoDetailForm.get('color').setValue(selectedRowData[0]['color']);
      this.fpoDetailForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
      this.fpoDetailForm.get('size').setValue(selectedRowData[0]['size']);
      this.fpoDetailForm
        .get('combinId')
        .setValue(selectedRowData[0]['combinId']);
      this.fpoDetailForm
        .get('combination')
        .setValue(selectedRowData[0]['combination']);
      this.fpoDetailForm.get('fpoQty').setValue(selectedRowData[0]['fpoQty']);
      this.fpoDetailForm
        .get('prevfpoQty')
        .setValue(selectedRowData[0]['prevfpoQty']);
      this.fpoDetailForm.get('jobQty').setValue(selectedRowData[0]['jobQty']);
      this.fpoDetailForm.get('balQty').setValue(selectedRowData[0]['balQty']);
    }
  }

  //// SAVE FPO
  saveFPO() {
    if (this.validateFPO()) {
      var FPOList = [];

      //console.log(this.jobHeaderForm.get('customerId').value);
      ////--------=========== FPO HEADER =======================---------
      var fpoHeader = {
        autoId: this.fpoHeaderForm.get('fpoId').value,
        jobHeaderId: this.fpoHeaderForm.get('jobHeaderId').value[0],
        fPONo: this.fpoHeaderForm.get('fPONo').value,
        startDate: this.datePipe.transform(
          this.fpoHeaderForm.get('startDate').value,
          'yyyy-MM-dd'
        ),
        endDate: this.datePipe.transform(
          this.fpoHeaderForm.get('endDate').value,
          'yyyy-MM-dd'
        ),
        remarks:
          this.fpoHeaderForm.get('remarks').value == null
            ? ''
            : this.fpoHeaderForm.get('remarks').value.trim(),
        qty: this.fpoHeaderForm.get('qty').value,
        createUserId: this.user.userId,
      };

      var obj = {
        FtyProductionOrderHd: fpoHeader,
      };
      FPOList.push(obj);

      ////--------=========== FPO DETAILS =======================---------
      var itemRows = this.fpoGrid.data;
      itemRows.forEach((items) => {
        var itemdata = {
          soItemDtId: items.soItemDtId,
          soDelivDtId: items.soDelivDtId,
          qty: items.fpoQty,
        };
        FPOList.push(itemdata);
      });

      console.log(FPOList);
      // // //console.log(JSON.stringify(menuList));
      this.salesOrderServices.saveFPO(FPOList).subscribe((result) => {
        if (result['result'] == 1) {
          this.toastr.success('FPO save Successfully !!!');
          this.fpoHeaderForm.get('fpoId').setValue(result['refNumId']);
          this.fpoHeaderForm.get('fPONo').setValue(result['refNum']);
          this.loadFPODetails();
        } else {
          this.toastr.warning(
            'Contact Admin. Error No:- ' + result['result'].toString()
          );
        }
      });
    }
  }

  ///// VALIDATION FOR FPO DETAILS
  validateFPO() {
    if (this.fpoGrid.dataLength > 0) {
      return true;
    } else {
      this.toastr.info('Fill the FPO details !!!');
      return false;
    }
  }

  refreshControls() {
    this.clearFPOControls();
    this.getFPORefNo();
    this.loadPendingJobList();
  }

  //// CLEAR ALL THE FPO DETAILS AND RESET FORMS
  clearFPOControls() {
    this.isDisplayMode = false;
    this.jobDtList = [];
    this.fpoList = [];
    this.fpoHeaderForm.enable();
    this.isGridDisabled = false;
    this.fpoStatus = '';

    this.fpoHeaderForm.get('fpoId').setValue(0);
    this.fpoHeaderForm.get('jobHeaderId').reset();
    this.fpoHeaderForm.get('startDate').reset();
    this.fpoHeaderForm.get('endDate').reset();
    this.fpoHeaderForm.get('remarks').reset();
    this.fpoHeaderForm.get('qty').reset();
    this.fpoHeaderForm.get('qty').disable();

    this.clearFPODetailControls();
  }

  //// FPO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode != 13) {
      this.jobDtList = [];
      this.fpoList = [];
      this.fpoHeaderForm.enable();
      this.isGridDisabled = false;

      this.fpoHeaderForm.get('fpoId').setValue(0);
      this.fpoHeaderForm.get('jobHeaderId').reset();
      this.fpoHeaderForm.get('startDate').reset();
      this.fpoHeaderForm.get('endDate').reset();
      this.fpoHeaderForm.get('remarks').reset();
      this.fpoHeaderForm.get('qty').reset();

      this.clearFPODetailControls();
    } else {
      this.loadFPODetails();
    }
  }

  //// LOADS EXISTING FPO DETAILS
  loadFPODetails() {
    this.clearFPOControls();

    //// VALIDATE FPO NUMBER IS EXISTS
    if (this.fpoHeaderForm.get('fPONo').value != '') {      
      var FPONo = this.fpoHeaderForm.get('fPONo').value;

      this.salesOrderServices.getFPODetails(FPONo).subscribe(
        (fpoDetails) => {
          // console.log(orderDt);
          var SavedFPOList = [];
          if (fpoDetails.length > 0) {
            /// RESET FORM CONTROLS
            this.fpoHeaderForm.disable();
            this.isGridDisabled = true;
            this.isDisplayMode = true;

            for (let index = 0; index < fpoDetails.length; index++) {
              ////========= SET FPO HEDER ================
              if (index == 0) {
                var startDate: Date = new Date(
                  this.datePipe.transform(
                    fpoDetails[index]['startDate'],
                    'yyyy-MM-dd'
                  )
                );
                var endDate: Date = new Date(
                  this.datePipe.transform(
                    fpoDetails[index]['endDate'],
                    'yyyy-MM-dd'
                  )
                );

                this.fpoHeaderForm.get('fpoId').setValue(fpoDetails[index]['autoId']);
                this.fpoHeaderForm.get('remarks').setValue(fpoDetails[index]['remarks']);
                this.fpoHeaderForm.get('qty').setValue(fpoDetails[index]['totFPOQty']);
                this.fpoHeaderForm.get('startDate').setValue(startDate);
                this.fpoHeaderForm.get('endDate').setValue(endDate);
                this.fpoHeaderForm.get('jobHeaderId').setValue(fpoDetails[index]['jobNo']);
                this.fpoHeaderForm.get('statusId').setValue(fpoDetails[index]['statusId']);
                this.fpoStatus = 'FPO ' + fpoDetails[index]['status'] ;
                // this.jobNo.setSelectedItem(
                //   fpoDetails[index]['jobHeaderId'],
                //   true
                // );
              }
              /// ========= SET FPO DETAILS TO GRID ================
              var orderItem = {
                soDelivDtId: fpoDetails[index]['soDelivDtId'],
                soItemDtId: fpoDetails[index]['soItemDtId'],
                deliveryRef: fpoDetails[index]['deliveryRef'],
                customerId: fpoDetails[index]['customerId'],
                customer: fpoDetails[index]['customer'],
                articleId: fpoDetails[index]['articleId'],
                articleName: fpoDetails[index]['articleName'],
                colorId: fpoDetails[index]['colorId'],
                color: fpoDetails[index]['color'],
                sizeId: fpoDetails[index]['sizeId'],
                size: fpoDetails[index]['size'],
                combinId: fpoDetails[index]['combinId'],
                combination: fpoDetails[index]['combination'],
                fpoQty: fpoDetails[index]['fpoQty'],
                prevfpoQty: fpoDetails[index]['prvFPOQty'],
                jobQty: fpoDetails[index]['jobQty'],
                balQty: fpoDetails[index]['balQty'],
              };
              SavedFPOList.push(orderItem);
            }
            this.fpoList = SavedFPOList;
          } else {
            this.toastr.info('FPO No not Found !!!');
          }
        },
        (err) => console.error(err)
      );
    } else {
      this.toastr.info('Enter FPO No !!!');
    }
  }

  deleteFPO() {
    if (this.fpoHeaderForm.get('statusId').value == 1) {
      var FPOList = {
        FPOId: this.fpoHeaderForm.get('fpoId').value,
        UserId: this.user.userId,
      };

      this.salesOrderServices.deleteFPO(FPOList).subscribe((result) => {
        console.log(result);
        if (result == 1) {
          this.toastr.success('Delete FPO Successfully !!!');
          this.clearFPOControls();
          this.getFPORefNo();
        } else if (result == -1) {
          this.toastr.success('Delete Failed, Production has started !!!');
        } else {
          this.toastr.warning(
            'Contact Admin. Error No:- ' + result.toString()
          );
        }
      });
    } else {
      this.toastr.success('Delete Failed, Production has started !!!');
    }
  }
}
