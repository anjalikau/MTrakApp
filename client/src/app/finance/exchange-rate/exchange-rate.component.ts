import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent, valueInRange } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { subscribeOn } from 'rxjs/operators';
import { Currency } from 'src/app/_models/currency';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css']
})
export class ExchangeRateComponent implements OnInit {
  exchangeRateForm: FormGroup;
  currencyList: Currency[];
  exchangeRateList: any;
  user: User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  @ViewChild('currFrom', { read: IgxComboComponent })
  public currFrom: IgxComboComponent;
  @ViewChild('currTo', { read: IgxComboComponent })
  public currTo: IgxComboComponent;

  @ViewChild('exchageRateGrid', { static: true })
  public exchageRateGrid: IgxGridComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

   // Date options
   public dateOptions = {
    format: 'yyyy-MM-dd',
    timezone: 'UTC+0'
  };

  public formatDateOptions = this.dateOptions;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private financeService: FinanceService,
    private datePipe: DatePipe,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCurrency();
    this.loadExchangeRate();
  }

   //// ALOW SINGLE SILECTION ONLY COMBO EVENT
   singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
   }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 168).length > 0) {
        this.saveButton = true;
      }
    }

    this.exchangeRateForm = this.fb.group({
      autoId: [0],     
      currencyFrom: ['' , Validators.required],     
      currencyTo: ['' , Validators.required],
      rate: [0 , Validators.required],
      validFrom:[ '' , Validators.required],
      validTo:['' , Validators.required]    
    },{ validators: this.currencyCompaire('currencyFrom', 'currencyTo' , 'validFrom' , 'validTo') });   
  }

  /// VALIDATE FROM AND TO CURRENCY
  currencyCompaire(curfrom: string, curto: string , validFrom: string , validTo: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let cf = group.controls[curfrom];
      let ct = group.controls[curto];
      let vf = group.controls[validFrom];
      let vt = group.controls[validTo];

      // console.log(vf.value);
      // console.log(vt.value);
      if (cf.value[0] != undefined && ct.value[0] != undefined) {
        if (cf.value[0] == ct.value[0]) {
          return {
            invalidCurrency: 'Currency can not be same',
          };
        }
      } if (vf.value != "" && vt.value != "") {
        if (vf.value >= vt.value) {
          return {
            invalidDate: "Date from should be less than Date to"
          };
        }
      }
      return {};
    };
  }

  loadCurrency() {
    // this.currencyList = [];
    this.masterService.getCurrency().subscribe((result) => {
      this.currencyList = result;
    });
  }  

  saveExchangeRate() {
    if(this.saveButton == true) {
    var obj = {
      autoId: this.exchangeRateForm.get("autoId").value,
      currencyFId: this.exchangeRateForm.get("currencyFrom").value[0],
      currencyTId: this.exchangeRateForm.get("currencyTo").value[0],
      rate: this.exchangeRateForm.get("rate").value,
      validFrom: this.datePipe.transform(this.exchangeRateForm.get("validFrom").value,'yyyy-MM-dd'),
      validTo: this.datePipe.transform(this.exchangeRateForm.get("validTo").value,'yyyy-MM-dd'),
      userId: this.user.userId
    }
    
    this.financeService.saveExchangeRate(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Exchange Rate save Successfully !!!');
        this.loadExchangeRate();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success('Exchange Rate update Successfully !!!');
        this.loadExchangeRate();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning('Exchange Rate already exists !!!');
      } else {
        this.toastr.error('Contact Admin. Error No:- ' + result.toString());
      }
    },
    (error) => {
      this.validationErrors = error;
    })
  } else {
    this.toastr.warning('Save permission denied !!!');
  }
  }

  loadExchangeRate() {
    this.financeService.getExchangeRate().subscribe(result => {
      this.exchangeRateList = result
      console.log(this.exchangeRateList);
    });    
  }

  onEditExchangeRate(event,cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.exchageRateGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var validFrom: Date = new Date(
      this.datePipe.transform(selectedRowData[0]['validFrom'], 'yyyy-MM-dd')
    );
    var validTo: Date = new Date(
      this.datePipe.transform(selectedRowData[0]['validTo'], 'yyyy-MM-dd')
    );

    //console.log(selectedRowData);
    this.currFrom.setSelectedItem(selectedRowData[0]['currencyFId'],true);
    this.currTo.setSelectedItem(selectedRowData[0]['currencyTId'] , true);    
    this.exchangeRateForm.get('validFrom').setValue(validFrom);
    this.exchangeRateForm.get('validTo').setValue(validTo);
    this.exchangeRateForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.exchangeRateForm.get('rate').setValue(selectedRowData[0]['rate']);
    this.exchangeRateForm.get('currencyFrom').disable();
    this.exchangeRateForm.get('currencyTo').disable();
  }

  clearControls() {
    this.exchangeRateForm.get("autoId").setValue(0);
    this.exchangeRateForm.get("currencyFrom").setValue("");
    this.exchangeRateForm.get("currencyTo").setValue("");
    this.exchangeRateForm.get("rate").setValue(0);
    this.exchangeRateForm.get("validFrom").setValue("");
    this.exchangeRateForm.get("validTo").setValue("");
    this.exchangeRateForm.get('currencyFrom').enable();
    this.exchangeRateForm.get('currencyTo').enable();
  }

}
