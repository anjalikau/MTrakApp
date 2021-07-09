import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-currency',
  templateUrl: './customer-currency.component.html',
  styleUrls: ['./customer-currency.component.css']
})
export class CustomerCurrencyComponent implements OnInit {
  custCurrencyForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  currencyList: any[];
  cusCurrencyList: any[];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];
  rowId: number = 0;

  @ViewChild('customerC', { read: IgxComboComponent })
  public customerC: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;

  @ViewChild('cusCurrencyGrid', { static: true })
  public cusCurrencyGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomer();
    this.loadCurrency();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    this.custCurrencyForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      currencyId: ['', [Validators.required]],
      customerCId: ['', [Validators.required]]      
    });
  }

  loadCurrency() {
    this.masterService.getCurrency().subscribe(currency => {
      this.currencyList = currency;
    })
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

  loadCustomer() {
    var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getCustomer(user.locationId).subscribe((cusList) => {
      this.customerList = cusList;
    });
  }

  onCustomerSelect(event) {
    this.cusCurrencyList = [];
    for (const item of event.added) {
      this.loadCustomerCurrencyDt(item);
    }
  }

  //// Loads Customer Currency list based on customer to grid
  loadCustomerCurrencyDt(customerId) {
    this.masterService.getCustomCurrency(customerId).subscribe((curList) => {
      this.cusCurrencyList = curList;
    });
    //console.log(this.cusUserList);
  }

  clearCustomerCurrency() {
    this.custCurrencyForm.get('autoId').setValue(0);
    this.custCurrencyForm.get('userId').setValue(this.user.userId);

    /// reset fileds
    this.custCurrencyForm.get('currencyId').reset();
    this.custCurrencyForm.get('customerCId').enable();
  }

  saveCustomerCurrency() {
    var customerId = this.custCurrencyForm.get('customerCId').value[0];
    var obj = {
      createUserId: this.user.userId,
      currencyId: this.custCurrencyForm.get('currencyId').value[0],
      autoId: this.custCurrencyForm.get('autoId').value,
      customerId: customerId,
    };

    //console.log(obj);
    this.masterService.saveCustomerCurrency(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Currency assign successfully !!!');
          this.loadCustomerCurrencyDt(customerId);
          this.clearCustomerCurrency();
        }  else if (result == -1) {
          this.toastr.warning('Currency already exists !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  /// delete currency event 
  onDeleteCusCurrency(event, cellId) {
    var customerId = this.custCurrencyForm.get('customerCId').value[0];

    const ids = cellId.rowID;
    const selectedRowData = this.cusCurrencyGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var obj = {
      createUserId: this.user.userId,
      currencyId: selectedRowData[0]['currencyId'],
      autoId: selectedRowData[0]['autoId']
    };

    console.log(obj);

    this.masterService.deleteCustomerCurrency(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Currency delete successfully !!!');
          this.loadCustomerCurrencyDt(customerId);
        }  else if (result == -1) {
          this.toastr.warning('Delete Fail !! Currency already assign !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  //// delete confirmation open dialog
  openDelivDialog(event, cellId) {
      this.rowId = cellId;
      this.dialog.open();    
  }

  //// delete confirmation ok buttun click event
  onDialogOKSelected(event) {
    event.dialog.close();
    this.onDeleteCusCurrency(event, this.rowId);
  }
 

}
