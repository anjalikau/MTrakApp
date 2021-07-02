import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-customerheader',
  templateUrl: './master-customerheader.component.html',
  styleUrls: ['./master-customerheader.component.css']
})
export class MasterCustomerheaderComponent implements OnInit {
  customerHdForm: FormGroup;
  user: User;
  customerHdList: CustomerHd[];
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild("customerHdGrid", { static: true })
  public customerHdGrid: IgxGridComponent;

  constructor(private fb: FormBuilder, private accountService: AccountService, private masterService: MasterService
    , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomerheader();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    this.customerHdForm = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Name: ['', [Validators.required, Validators.maxLength(200)]],
      Address: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.maxLength(50)]],
      Tel: ['', [Validators.required, Validators.maxLength(10)]],
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;

  }

  loadCustomerheader() {
    this.masterService.getCustomerHeader().subscribe(cardList => {
      this.customerHdList = cardList;
    })
  }

  saveHeader() {
    var obj = {
      "createUserId": this.user.userId,
      "Name": this.customerHdForm.get('Name').value.trim(),
      "autoId": this.customerHdForm.get('AutoId').value,
      "Address": this.customerHdForm.get('Address').value.trim(),
      "Email": this.customerHdForm.get('Email').value.trim(),
      "Tel": this.customerHdForm.get('Tel').value.trim(),
      "LocationId": 1,
    }

    this.masterService.saveCustomerHeader(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Customer save Successfully !!!");
        this.loadCustomerheader();
        this.cancelCustomerHd();
      } else if (result == 2) {
        this.toastr.success("Customer update Successfully !!!");
        this.loadCustomerheader();
        this.cancelCustomerHd();
      } else if (result == -1) {
        this.toastr.warning("Customer already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }

    }, error => {
      this.validationErrors = error;
    })
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    const selectedRowData = this.customerHdGrid.data.filter((record) => {
      return record.autoId == id;
    });
    const name = (selectedRowData[0]["name"]);
    var obj = {
      "createUserId": this.user.userId,
      "autoId": id,
      "bActive": false,
      "Name": name
    }

    this.deactiveCustomer(obj, "Deactive");
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    const selectedRowData = this.customerHdGrid.data.filter((record) => {
      return record.autoId == id;
    });
    const name = (selectedRowData[0]["name"]);
    var obj = {
      "createUserId": this.user.userId,
      "autoId": id,
      "bActive": true,
      "Name": name
    }
    this.deactiveCustomer(obj, "Active");
  }

  deactiveCustomer(obj, status) {
    this.masterService.deactiveCustomerHeader(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Customer " + status + " Successfully !!!");
        this.loadCustomerheader();
      } else if (result == 2) {
        this.toastr.success("Customer " + status + " Successfully !!!");
        this.loadCustomerheader();
      } else if (result == -1) {
        this.toastr.warning("Can't Deactive! Customer Have Datails !");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }

    }, error => {
      this.validationErrors = error;
    })
  }

  cancelCustomerHd() {
    this.customerHdForm.reset();
    this.customerHdForm.get('AutoId').setValue(0);
    this.customerHdForm.get('CreateUserId').setValue(this.user.userId);
  }


  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.customerHdGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.customerHdForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.customerHdForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.customerHdForm.get('Address').setValue(selectedRowData[0]["address"]);
    this.customerHdForm.get('Email').setValue(selectedRowData[0]["email"]);
    this.customerHdForm.get('Tel').setValue(selectedRowData[0]["tel"]);
  }
}
