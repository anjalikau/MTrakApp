import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/_models/bank';
import { Currency } from 'src/app/_models/currency';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  bankForm: FormGroup;
  bankList: any; 
  currencyList: Currency[];
  user: User;
  validationErrors: string[] = [];
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('bankGrid', { static: true })
  public bankGrid: IgxGridComponent;

  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private financeService: FinanceService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCurrency();
    this.loadBank();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 173).length > 0) {
        this.saveButton = true;
      }
    }

    this.bankForm = this.fb.group({
      autoId: [0],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      branch: ['', [Validators.required , Validators.maxLength(100)]],
      accountNo: ['', [Validators.required , Validators.maxLength(500)]],
      currency: ['', Validators.required], 
      nextChequeNo: [0 , Validators.required]   
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

   loadCurrency() {
    // this.currencyList = [];
    this.masterService.getCurrency().subscribe((result) => {
      this.currencyList = result;
    });
  }  

  saveBank() {
    if(this.saveButton == true) {
      var obj = {
        autoId: this.bankForm.get("autoId").value,
        name: this.bankForm.get("name").value,
        branch: this.bankForm.get("branch").value,
        accountNo: this.bankForm.get("accountNo").value,
        currencyId: this.bankForm.get("currency").value[0],
        nextChequeNo: this.bankForm.get("nextChequeNo").value,
        createUserId: this.user.userId
      }

      this.financeService.saveBank(obj).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Bank save Successfully !!!');
          this.loadBank();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Bank already exists !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      })
    } else {
      this.toastr.error("Save permission denied !!!");
    }
  }

  clearControls() {
    this.bankForm.get("autoId").setValue(0);
    this.bankForm.get("name").setValue("");
    this.bankForm.get("branch").setValue("");
    this.bankForm.get("accountNo").setValue("");
    this.bankForm.get("currency").setValue("");
    this.bankForm.get("nextChequeNo").setValue(0);
  }

  loadBank() {
    this.financeService.getBank().subscribe(result => {
      this.bankList = result
    })
  }

}
