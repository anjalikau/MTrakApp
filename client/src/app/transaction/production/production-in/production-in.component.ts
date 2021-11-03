import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-production-in',
  templateUrl: './production-in.component.html',
  styleUrls: ['./production-in.component.css'],
})
export class ProductionInComponent implements OnInit {
  fppoInForm: FormGroup;
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
  prvOutQty: number = 0;
  lastInQty: number = 0;
  transDate: Date = new Date(Date.now());
  todayTotQty: number = 0;
  todayTotList: any;
  saveButton: boolean = false;

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

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 160).length > 0) {
        this.saveButton = true;
      }
    }

    this.fppoInForm = this.fb.group(
      {
        fPPODId: ['', Validators.required],
        userId: this.user.userId,
        receiveSiteId: [{ value: 0 }],
        dispatchId: [{ value: 0 }],
        reqQty: [{ value: 0, disabled: true }],
        inQty: ['', Validators.required],
        balQty: [{ value: 0, disabled: true }],
        // prvOutQty: [{ value: 0, disabled: true }]
      },
      { validators: this.qtyLessThanBal('balQty', 'inQty') }
    );
  }

  loadProductionTotal() {
    this.salesOrderServices.getTransProductionTot().subscribe((result) => {
      this.todayTotList = result.filter((x) => x.transType == 1);

      if (this.todayTotList.length > 0) {
        // console.log(this.todayTotList);
        this.todayTotQty = this.todayTotList[0]['qty'];
      } else {
        this.todayTotQty = 0;
      }
    });
  }

  /// VALIDATE In Qty WITH BAL QTY
  qtyLessThanBal(balQty: string, InQty: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let bal = group.controls[balQty];
      let qty = group.controls[InQty];
 
      if (bal.value != 0 && qty.value != 0) {
        if (qty.value < 0) {
          return {
            quantity: ['Invalid In Qty'],
          };
        } else if (bal.value < qty.value) {
          return {
            quantity: 'In Qty should be less than Bal Qty',
          };
        }
      } else {
        return {
          quantity: 'Invalid In Qty',
        };
      }
      return {};
    };
  }

  //// FPPO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode == 13) {
      this.loadProdInDetails();
    }
  }

  onSearchChange(searchValue: string): void {
    // console.log(searchValue);
    this.clearControls();
  }

  loadProdInDetails() {
    const fPPODId = this.fppoInForm.get('fPPODId').value;

    if (fPPODId > 0) {
      this.salesOrderServices.getFPPOInDetails(fPPODId).subscribe((result) => {
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
        this.prvOutQty = result['prvOutQty'];
        this.lastInQty = result['inQty'];

        this.fppoInForm.get('receiveSiteId').setValue(result['receiveSiteId']);
        this.fppoInForm.get('dispatchId').setValue(result['dispatchId']);
        this.fppoInForm.get('reqQty').setValue(result['reqQty']);
        this.fppoInForm.get('balQty').setValue(result['balQty']);
      });
    } else {
      this.toastr.warning('Invalid FPO Number !!!');
    }
  }

  saveFPPOInDetails() {
    if(this.saveButton == true) {
    var obj = {
      fPPODId: this.fppoInForm.get('fPPODId').value,
      validationQty: this.fppoInForm.get('balQty').value,
      qty: this.fppoInForm.get('inQty').value,
      receiveSiteId: this.fppoInForm.get('receiveSiteId').value,
      dispatchId: this.fppoInForm.get('dispatchId').value,
      createUserId: this.fppoInForm.get('userId').value,
    };

    this.salesOrderServices.saveFPPOInDetails(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('Transaction In save Successfully !!!');
        this.refreshControls();
        this.loadProductionTotal();
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
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
    this.lastInQty = 0;
    this.prvOutQty = 0;
    // this.todayTotQty = 0;

    this.fppoInForm.get('receiveSiteId').reset();
    this.fppoInForm.get('dispatchId').reset();
    this.fppoInForm.get('reqQty').reset();
    this.fppoInForm.get('balQty').reset();
    this.fppoInForm.get('inQty').reset();
  }

  refreshControls() {
    this.fppoInForm.get('fPPODId').reset();
    this.clearControls();
    this.loadProductionTotal();
  }

  // this.fppoInForm.get('fPONo').reset();
  // this.fppoInForm.get('deliveryRef').reset();
  // this.fppoInForm.get('customerRef').reset();
  // this.fppoInForm.get('orderRef').reset();
  // this.fppoInForm.get('articleName').reset();
  // this.fppoInForm.get('color').reset();
  // this.fppoInForm.get('size').reset();
  // this.fppoInForm.get('process').reset();
  // this.fppoInForm.get('receiveSite').reset();
  // this.fppoInForm.get('dispatchName').reset();
  // this.fppoInForm.get('jobNo').reset();
}
