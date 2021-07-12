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
  styleUrls: ['./fac-prod-order.component.css']
})
export class FacProdOrderComponent implements OnInit {
  fpoHeaderForm: FormGroup;
  user: User;
  pendJobList: any[];
  jobDetails: any[];

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

   // Date options
   public dateOptions = {
    format: 'yyyy-MM-dd',
    //timezone: 'UTC+0',
  };
  public formatDateOptions = this.dateOptions;
  
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadPendingJobList();
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
      startDate: ['' , Validators.required],
      endDate: ['', Validators.required],
      // statusId: ['', Validators.required],
      remarks : [''],
      qty: [{ value: 0, disabled: true }]
    });    
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
    this.salesOrderServices.getFPOPendingJobs().subscribe(jobs => {
      this.pendJobList = jobs
    })
  }

  //// ON JOB NO SELECT CHANGED
  onJobNoSelect(event){
    this.jobDetails = [];
    for (const item of event.added) {
      //console.log(item);
      this.loadPendingJobDetails(item);
    }
  }

  /// LOADS PENDING JOB DETAILS BASED ON THE JOB NO
  loadPendingJobDetails(jobId) {
    this.salesOrderServices.getFPOPendingJobDt(jobId).subscribe(jobDt => {
      this.jobDetails = jobDt
    })
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

    if (FPORows.length > 0) {
      this.toastr.warning('Item is exists in job card');
      this.pendJobDtGrid.updateCell(true, ids, 'status');
      return;
    } else {
      if (selectedRowData.length > 0) {
        this.onAddFPOItem(selectedRowData);
      }
    }
  }

   /// MOVE PENDING JOB ORDER TO FPO GRID
   onAddFPOItem(selectedRowData) {
    console.log(selectedRowData);
    var orderQty = selectedRowData[0]['orderQty'];
    var JobQty = 0, balQty = 0, planQty = 0;

    // /// FROM PENDING DELIVERY ORDES
    // prvJobQty = selectedRowData[0]['jobQty'];
    // jobQty = 0;
    // balQty = orderQty - (prvJobQty + jobQty);

    var obj = {
      soDelivDtId: selectedRowData[0]['orderRef'],
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
      fpoQty: selectedRowData[0]['fpoQty'],
      jobQty: selectedRowData[0]['jobQty'],
      balQty: selectedRowData[0]['balQty'],
          
    };
    this.fpoGrid.addRow(obj);
  }


  saveFPO(){

  }

  clearFPOControls() {

  }

  onKey(event: any) {
    
  }

}
