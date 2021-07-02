import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { CustomerHd } from 'src/app/_models/customerHd';
import { CustomerDt } from 'src/app/_models/customerDt';

@Component({
  selector: 'app-master-customerdetails',
  templateUrl: './master-customerdetails.component.html',
  styleUrls: ['./master-customerdetails.component.css']
})
export class MasterCustomerdetailsComponent implements OnInit {
  customerDtForm: FormGroup;
  customerHdList: CustomerHd[];
  customerDtList: CustomerDt[];
  user: User;
  saveobj: CustomerDt;
  validationErrors: string[] = [];
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("Detailsgrid", { static: true }) 
  public Detailsgrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
      ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadHeaderlist();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.customerDtForm = this.fb.group ({
      AutoId : [0],
      CreateUserId : this.user.userId,
      Address: ['', Validators.required ],
      Name: ['', [Validators.required , Validators.maxLength(200)]],
      Email: ['', [Validators.required , Validators.maxLength(50)]],
      Tel: ['', [Validators.required , Validators.maxLength(10)]],
      CustomerId: ['',Validators.required],
   
    })
  } 

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadHeaderlist(){
    this.masterService.getCustomerHeader().subscribe(cardList => {
      this.customerHdList = cardList;
    })
  }

  loadDetailsList(Detailscrd) { 
      this.masterService.getCustomerDetails(Detailscrd).subscribe(details => {
        console.log(details);
        this.customerDtList = details;       
      })
  }    

  loadGridDetails(event){
    this.clearGridRows();
    for(const item of event.added) {
      this.loadDetailsList(item);
    }    
  }

  clearGridRows() {
    this.Detailsgrid.deselectAllRows();
    this.customerDtList = [];
  }

  refreshPage() {   
    this.customerDtForm.reset();
    this.clearControls();
    this.clearGridRows();
  }

  saveDetails() { 
    var Detailscrd = this.customerDtForm.get('CustomerId').value[0];
    //console.log("xx");
    var obj = {
      "createUserId": this.user.userId,
      "customerId" : this.customerDtForm.get('CustomerId').value[0],
      "Address" : this.customerDtForm.get('Address').value.trim(),
      "name" : this.customerDtForm.get('Name').value.trim(),
      "Email" : this.customerDtForm.get('Email').value.trim(),
      "Tel" : this.customerDtForm.get('Tel').value.trim(),
      "autoId" : this.customerDtForm.get('AutoId').value
    }

   // this.saveobj = Object.assign({}, obj);
    //console.log(obj);
    this.masterService.saveCustomerDetails(obj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Customer Details save Successfully !!!");
        this.loadDetailsList(Detailscrd);
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Customer Details update Successfully !!!");
        this.loadDetailsList(Detailscrd);
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Customer Details already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }    
       
    }, error => {
      this.validationErrors = error;
    }) 
  }

  clearControls() {
    //this.masterColor.reset();
    this.customerDtForm.get('AutoId').setValue(0);
    this.customerDtForm.get('CreateUserId').setValue(this.user.userId);
    this.customerDtForm.get('Email').setValue("");
    this.customerDtForm.get('Address').setValue("");
    this.customerDtForm.get('Tel').setValue("");
    this.customerDtForm.get('Name').setValue("");
  }

  resetControls(){
    this.customerDtForm.reset();
    this.clearControls();
    this.clearGridRows();
  }

   //// EDIT ROW LOADS DETAILS TO CONTROL 
   onEdit(event,cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;    
    const selectedRowData = this.Detailsgrid.data.filter((record) => {
        return record.autoId == ids;
    });

    console.log(selectedRowData);
    this.customerDtForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.customerDtForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.customerDtForm.get('Address').setValue(selectedRowData[0]["address"]);
    this.customerDtForm.get('Email').setValue(selectedRowData[0]["email"]);
    this.customerDtForm.get('Tel').setValue(selectedRowData[0]["tel"]);
  }

}
