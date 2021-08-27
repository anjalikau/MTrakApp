import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-production-out',
  templateUrl: './production-out.component.html',
  styleUrls: ['./production-out.component.css'],
})
export class ProductionOutComponent implements OnInit {
  fppoOutForm: FormGroup;
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
  damageQty: number = 0;
  lastOutQty: number = 0;
  transDate: Date = new Date(Date.now());
  todayTotQty: number = 0;
  todayTotList: any;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProductionTotal();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.fppoOutForm = this.fb.group(
      {
        fPPODId: ['', Validators.required],
        userId: this.user.userId,
        receiveSiteId: [{ value: 0 }],
        dispatchId: [{ value: 0 }],
        // reqQty: [{ value: 0, disabled: true }],
        outQty: ['', Validators.required],
        inQty: [{ value: 0, disabled: true }],
        // damageQty: [{ value: 0, disabled: true }],
        balQty: [{ value: 0, disabled: true }],
        // prvOutQty: [{ value: 0, disabled: true }]
      },
      { validators: this.qtyLessThanBal('balQty', 'outQty') }
    );
  }

  loadProductionTotal() {
    this.salesOrderServices.getTransProductionTot().subscribe((result) => {
      this.todayTotList = result.filter((x) => x.transType == 2);
      // console.log(this.todayTotList);
      if (this.todayTotList.length > 0) {
        this.todayTotQty = this.todayTotList[0]['qty'];
      } else {
        this.todayTotQty = 0;
      }
    });
  }

  /// VALIDATE In Qty WITH BAL QTY
  qtyLessThanBal(balQty: string, OutQty: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let bal = group.controls[balQty];
      let qty = group.controls[OutQty];
      // console.log(f.value);
      // console.log(t.value);

      if (bal.value != 0 && qty.value != 0) {
        if (qty.value < 0) {
          return {
            quantity: 'Invalid Out Qty',
          };
        } else if (bal.value < qty.value) {
          return {
            quantity: 'Out Qty should be less than Bal Qty',
          };
        }
      } else {
        return {
          quantity: 'Invalid Out Qty',
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
    const fPPODId = this.fppoOutForm.get('fPPODId').value;
    // console.log(this.fppoOutForm.get('fPPODId').value);

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
        this.damageQty = result['damageQty'];
        this.lastOutQty = result['outQty'];

        this.fppoOutForm.get('receiveSiteId').setValue(result['receiveSiteId']);
        this.fppoOutForm.get('dispatchId').setValue(result['dispatchId']);
        // this.fppoOutForm.get('reqQty').setValue(result['reqQty']);
        this.fppoOutForm.get('balQty').setValue(result['balQty']);
        this.fppoOutForm.get('inQty').setValue(result['inQty']);
        // this.fppoOutForm.get('damageQty').setValue(result['damageQty']);
      });
    } else {
      this.toastr.warning('Invalid FPO Number !!!');
    }
  }

  saveFPPOOutDetails() {
    var obj = {
      fPPODId: this.fppoOutForm.get('fPPODId').value,
      validationQty: this.fppoOutForm.get('balQty').value,
      qty: this.fppoOutForm.get('outQty').value,
      receiveSiteId: this.fppoOutForm.get('receiveSiteId').value,
      dispatchId: this.fppoOutForm.get('dispatchId').value,
      createUserId: this.fppoOutForm.get('userId').value,
    };

    this.salesOrderServices.saveFPPOOutDetails(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('Transaction Out save Successfully !!!');
        this.refreshControls();
      } else if (result == -1) {
        this.toastr.success('Balance Qty not enough, Check again !!!');
        this.refreshControls();
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
      this.loadProductionTotal();
    });
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
    this.damageQty = 0;
    this.lastProcess = false;
    this.lastOutQty = 0;

    this.fppoOutForm.get('receiveSiteId').reset();
    this.fppoOutForm.get('dispatchId').reset();
    this.fppoOutForm.get('inQty').reset();
    this.fppoOutForm.get('balQty').reset();
    this.fppoOutForm.get('outQty').reset();
  }

  refreshControls() {
    this.fppoOutForm.get('fPPODId').reset();
    this.clearControls();
    this.loadProductionTotal();
  }
}
