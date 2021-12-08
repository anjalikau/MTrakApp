import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.css'],
})
export class QualityControlComponent implements OnInit {
  qualityCForm: FormGroup;
  user: User;
  fPONo: string = '';
  jobNo: string = '';
  orderRef: string = '';
  receiveSite: string = '';
  dispatchName: string = '';
  deliveryRef: string = '';
  deliveryDate: string;
  process: string = '';
  customerRef: string = '';
  articleName: string = '';
  color: string = '';
  size: string = '';
  lastProcess: boolean;
  prvRejectQty: number= 0;
  outQty: number = 0;
  transDate: Date = new Date(Date.now());
  todayTotQty: number = 0;
  todayTotList: any;
  rejReasonList: any[];
  saveButton: boolean = false;

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
    this.loadProductionTotal();
    this.loadRejectReason();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 162).length > 0) {
        this.saveButton = true;
      }
    }

    this.qualityCForm = this.fb.group(
      {
        fPPODId: ['', Validators.required],
        userId: this.user.userId,
        receiveSiteId: [{ value: 0 }],
        dispatchId: [{ value: 0 }],
        // reqQty: [{ value: 0, disabled: true }],
        // outQty: [{ value: 0, disabled: true }],
        inQty: [{ value: 0, disabled: true }],
        rejectQty: ['', Validators.required],
        balQty: [{ value: 0, disabled: true }],
        reasonId: ['', Validators.required],
      },
      { validators: this.qtyLessThanBal('balQty', 'rejectQty') }
    );
  }

  // singleSelection(event: IComboSelectionChangeEventArgs) {
  //   if (event.added.length) {
  //     event.newSelection = event.added;
  //   }
  // }

  loadProductionTotal() {
    this.salesOrderServices.getTransProductionTot().subscribe((result) => {
      this.todayTotList = result.filter((x) => x.transType == 3);
      // console.log(this.todayTotList);
      if (this.todayTotList.length > 0) {
        this.todayTotQty = this.todayTotList[0]['qty'];
      } else {
        this.todayTotQty = 0;
      }
    });
  }

  //// LOADS REJECT REASON
  loadRejectReason() {
    this.rejReasonList = [];
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterServices.getRejectReason(locationId).subscribe((result) => {
      this.rejReasonList = result;
    });
  }

  /// VALIDATE In Qty WITH BAL QTY
  qtyLessThanBal(balQty: string, rejectQty: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let bal = group.controls[balQty];
      let qty = group.controls[rejectQty];
      // console.log(f.value);
      // console.log(t.value);

      if (bal.value != 0 && qty.value != 0) {
        if (qty.value < 0) {
          return {
            quantity: 'Invalid Reject Qty',
          };
        } else if (bal.value < qty.value) {
          return {
            quantity: 'Reject Qty should be less than Bal Qty',
          };
        }
      } else {
        return {
          quantity: 'Invalid Reject Qty',
        };
      }
      return {};
    };
  }

  //// FPPO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode == 13) {
      this.loadTransOutDetails();
    }
  }

  onSearchChange(searchValue: string): void {
    // console.log(searchValue);
    this.clearControls();
  }

  loadTransOutDetails() {
    const fPPODId = this.qualityCForm.get('fPPODId').value;

    if (fPPODId > 0) {
      this.salesOrderServices.getFPPOOutDetails(fPPODId).subscribe((result) => {
        let deliDate = new Date(
          this.datePipe.transform(result['deliveryDate'], 'yyyy-MM-dd')
        );
        // console.log(deliDate);

        this.fPONo = result['fpoNo'];
        this.jobNo = result['jobNo'];
        this.deliveryDate = deliDate.toDateString();
        this.deliveryRef = result['deliveryRef'];
        this.orderRef = result['orderRef'];
        this.customerRef = result['customerRef'];
        this.articleName = result['articleName'];
        this.color = result['color'];
        this.size = result['size'];
        this.process = result['process'];
        this.receiveSite = result['receiveSite'];
        this.dispatchName = result['dispatchName'];
        this.lastProcess = result['lastProcess'];
        this.prvRejectQty = result['damageQty'];
        this.outQty = result["outQty"];

        this.qualityCForm
          .get('receiveSiteId')
          .setValue(result['receiveSiteId']);
        this.qualityCForm.get('dispatchId').setValue(result['dispatchId']);
        // this.qualityCForm.get('reqQty').setValue(result['reqQty']);
        this.qualityCForm.get('balQty').setValue(result['balQty']);
        this.qualityCForm.get('inQty').setValue(result['inQty']);
        // this.qualityCForm.get('damageQty').setValue(result['damageQty']);
      });
    } else {
      this.toastr.warning('Invalid FPO Number !!!');
    }
  }

  saveFPPORejectDetails() {
    if(this.saveButton == true) {
    var reasonList = this.qualityCForm.get('reasonId').value;
    var rejectList = [];

    for (let index = 0; index < reasonList.length; index++) {
      // const element = reasonList[index];
      var obj = {
        fPPODId: this.qualityCForm.get('fPPODId').value,
        validationQty: this.qualityCForm.get('balQty').value,
        qty: this.qualityCForm.get('rejectQty').value,
        receiveSiteId: this.qualityCForm.get('receiveSiteId').value,
        dispatchId: this.qualityCForm.get('dispatchId').value,
        createUserId: this.qualityCForm.get('userId').value,
        rejReasonId: reasonList[index],
      };

      rejectList.push(obj);
    }

    // console.log(rejectist);
    this.salesOrderServices
      .saveFPPORejectDetails(rejectList)
      .subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Reject Qty save Successfully !!!');
          this.refreshControls();
        } else if (result == -1) {
          this.toastr.success('Balance Qty not enough, Check again !!!');
          this.refreshControls();
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
        this.loadProductionTotal();
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  clearControls() {
    this.fPONo = '';
    this.jobNo = '';
    this.deliveryDate = '';
    this.deliveryRef = '';
    this.orderRef = '';
    this.customerRef = '';
    this.articleName = '';
    this.color = '';
    this.size = '';
    this.process = '';
    this.receiveSite = '';
    this.dispatchName = '';
    // this.todayTotQty = 0;
    this.prvRejectQty = 0;
    this.lastProcess = false;
    this.outQty = 0;

    this.qualityCForm.get('receiveSiteId').reset();
    this.qualityCForm.get('dispatchId').reset();
    this.qualityCForm.get('outQty').reset();
    this.qualityCForm.get('inQty').reset();
    this.qualityCForm.get('balQty').reset();
    this.qualityCForm.get('rejectQty').reset();
    this.qualityCForm.get('reasonId').reset();
  }

  refreshControls() {
    this.qualityCForm.get('fPPODId').reset();
    this.clearControls();
    this.loadProductionTotal();
  }
}
