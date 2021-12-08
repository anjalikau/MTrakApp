import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Tax } from 'src/app/_models/tax';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {
  taxForm: FormGroup;
  taxList: Tax[]; 
  user: User;
  validationErrors: string[] = [];
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('taxGrid', { static: true })
  public taxGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private financeService: FinanceService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadTax();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 170).length > 0) {
        this.saveButton = true;
      }
    }

    this.taxForm = this.fb.group({
      autoId: [0],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      rate: ['', [Validators.required]]    
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  saveTax() {
    if(this.saveButton == true) {
      var obj = {
        autoId: this.taxForm.get("autoId").value,
        description: this.taxForm.get("description").value,
        rate: this.taxForm.get("rate").value,
        createUserId: this.user.userId
      }

      this.financeService.saveTax(obj).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Tax save Successfully !!!');
          this.loadTax();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Tax update Successfully !!!');
          this.loadTax();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Tax already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      })
    } else {
      this.toastr.error("Save permission denied !!!");
    }
  }

  onEditTax(event,cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.taxGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.taxForm.get('description').setValue(selectedRowData[0]['description']);
    this.taxForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.taxForm.get('rate').setValue(selectedRowData[0]['rate']);
    this.taxForm.get('description').disable();
  }

  clearControls() {
    this.taxForm.get("autoId").setValue(0);
    this.taxForm.get("description").setValue("");
    this.taxForm.get("rate").setValue(0);
    this.taxForm.get('description').enable();
  }

  loadTax() {
    this.financeService.getTax().subscribe(result => {
      this.taxList = result
    })
  }

}
