import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { RejectReasons } from 'src/app/_models/RejectReasons';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.css']
})
export class RejectReasonComponent implements OnInit {
  rejReasonForm: FormGroup;
  rejReasonList: RejectReasons[]; 
  user: User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('rejReasonGrid', { static: true })
  public rejReasonGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadRejectReason();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 112).length > 0) {
        this.saveButton = true;
      }
    }

    this.rejReasonForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      details: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadRejectReason() {   
    this.rejReasonList = [];
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterService.getRejectReason(locationId).subscribe((result) => {
      this.rejReasonList = result;
    });
  }  

  saveRejectReason() {
    if(this.saveButton == true) {
    // var loc: User = JSON.parse(localStorage.getItem('user'));
    var obj = {
      autoId: this.rejReasonForm.get('autoId').value,
      createUserId: this.user.userId,
      details: this.rejReasonForm.get('details').value.trim(),     
      locationId: this.user.locationId
    };

    // console.log(this.saveobj);
    this.masterService.saveRejectReason(obj).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Reject Reason save Successfully !!!');
          this.loadRejectReason();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Reject Reason update Successfully !!!');
          this.loadRejectReason();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Reject Reason already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Reject Reason fail, already in use !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onEditRejReason(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.rejReasonGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.rejReasonForm.get('details').setValue(selectedRowData[0]['details']);
    this.rejReasonForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }

  clearControls() {
    //this.masterColor.reset();
    this.rejReasonForm.get('autoId').setValue(0);
    this.rejReasonForm.get('createUserId').setValue(this.user.userId);
    this.rejReasonForm.get('details').setValue('');
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }
}
