import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { ApproveCenter } from 'src/app/_models/ApproveCenter';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { RegisterService } from '_services/register.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-approve-center',
  templateUrl: './approve-center.component.html',
  styleUrls: ['./approve-center.component.css'],
})
export class ApproveCenterComponent implements OnInit {
  approveList: ApproveCenter[];
  approveForm: FormGroup;
  validationErrors: string[] = [];
  user: User;
  saveButton: boolean = false;
  approveRoteList: any[];
  appButton: boolean = false;
  okButton: boolean = false;
  selectedRowData: any[];

  public pWidth: string;
  public nWidth: string;
  public col: IgxColumnComponent;

  @ViewChild('approveGrid', { static: true })
  public approveGrid: IgxGridComponent;

  @ViewChild('approver', { read: IgxComboComponent })
  public approver: IgxComboComponent;

  @ViewChild('approveModal', { read: IgxDialogComponent })
  public approveModal: IgxDialogComponent;

  constructor(
    public salesOrderServices: SalesorderService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadApproveList();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });    

    this.approveForm = this.fb.group({
      approver: ['', Validators.required],
      remark: ['', [Validators.maxLength(250)]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

   ///// GET APPROVE ROUTING DETAILS BASED ON USER ID AND MODULE
   getApproveRouteDetails() {
    var obj = {
      userId: this.user.userId,
      module: this.selectedRowData[0]['moduleName']
    };

    this.salesOrderServices.getApproveRouteDetails(obj).subscribe((result) => {      
        this.approveRoteList = result; 

        // console.log(this.approveRoteList);          
        /// check IF FINAL APPROVE
        if (this.selectedRowData[0]['isFinal'] == 1) {
          this.approveForm.get('approver').disable();
          this.appButton = true;
          this.okButton = false;
        } else {
          this.approveForm.get('approver').enable();
          this.appButton = false;
          this.okButton = true;
        }
        this.approveModal.open();        
    },
    (err) => console.error(err),
    () => {
        this.setDefaultUser();
    });
  }

  setDefaultUser() {
    setTimeout(() => {
      //// SELECT DEFAULT USER 
      var defaultUser = this.approveRoteList.filter(x => x.isDefault == true);
      if (defaultUser.length > 0)
        this.approver.setSelectedItem( defaultUser[0]["idAgents"] ,true);
    }, 500);
  }

  loadApproveList() {
    var userId = this.user.userId;

    this.salesOrderServices.getApproveCenterDt(userId).subscribe((result) => {
      this.approveList = result;
    });
  }

  onApproveRoute(event, cellId) {
    var ids = cellId.rowID;
    this.selectedRowData = [];
    this.approveForm.get('approver').setValue('');
    this.approveForm.get('remark').setValue('');

    this.selectedRowData = this.approveGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.getApproveRouteDetails();
    // this.approveRouteCostSheet(selectedRowData);
  }

  //// APPROVE ROUTING PROCESS
  approveRouteCostSheet(status) {
    var obj = {
      autoId: this.selectedRowData[0]['autoId'],
      moduleName: this.selectedRowData[0]['moduleName'],
      assigneUser:
        this.approveForm.get('approver').value[0] == undefined
          ? 0
          : this.approveForm.get('approver').value[0],
      requestedBy: this.user.userId,
      refId: this.selectedRowData[0]['refId'],
      refNo: this.selectedRowData[0]['refNo'],
      remarks: this.approveForm.get('remark').value,
      details: this.selectedRowData[0]['details'],
      isFinal: this.selectedRowData[0]['isFinal'],
      status: status,
    };
    // console.log(obj);

    this.salesOrderServices.saveApproveCenterDt(obj).subscribe((result) => {
      if (result == 1) {
        if (status == 'Waiting') {
          this.toastr.success('Approve sent is successfully !!!');
        } else if (status == 'Approve') {
          this.toastr.success('Approve successfully !!!');
        } else if (status == 'Reject') {
          this.toastr.success('Reject successfully !!!');
        }
        this.approveModal.close();
        this.loadApproveList();
      } else if (result == -1) {
        this.toastr.success('Approve details already exists !!!');
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }

  previewCostSheet(event, cellId) {
    var ids = cellId.rowID;
    const selectedRowData = this.approveGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var obj = {
      costingHdId: selectedRowData[0]["refId"],
      reportName: 'CostSheetFormat',
    };
    /// STORE OBJECT IN LOCAL STORAGE
    localStorage.setItem('params', JSON.stringify(obj));
    window.open('/boldreport', '_blank');
  }

}

