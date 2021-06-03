import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { MstrUnits } from 'src/app/_models/mstrUnits';


@Component({
  selector: 'app-master-units',
  templateUrl: './master-units.component.html',
  styleUrls: ['./master-units.component.css']
})
export class MasterUnitsComponent implements OnInit {
  mstrUnits: FormGroup;
  sizeUnitList: MstrUnits[];
  sizeList: Size[];
  user: User;
  saveobj: MstrUnits;
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("sizeGrid", { static: true }) 
  public sizeGrid: IgxGridComponent;

  constructor(private accountService: AccountService,private masterService: MasterService,private fb: FormBuilder,private toastr: ToastrService ) { }

  ngOnInit(): void {     
    this.initilizeForm();
    this.LoadUnits();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  LoadUnits(){
    this.masterService.getUnits().subscribe(cardList => {
      this.sizeUnitList = cardList;
    })
  }

  refreshPage() {
    this.mstrUnits.reset();
  }
  
  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });
     
    this.mstrUnits = this.fb.group ({
      AutoId : [0],
      CreateUserId : this.user.userId,
      Code: ['', [Validators.required , Validators.maxLength(10)]],
      Name: ['', [Validators.required , Validators.maxLength(30)]],
      
    })
  } 
 
  EditUnit() {     
    var obj = {
      "createUserId": this.user.userId,     
      "code" : this.mstrUnits.get('Code').value.trim(),
      "name" : this.mstrUnits.get('Name').value.trim(),
      "autoId" : this.mstrUnits.get('AutoId').value
    }

    this.saveobj = Object.assign({}, obj);
    //console.log(this.saveobj);
    this.masterService.editUnits(this.saveobj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Unit save Successfully !!!");
        this.LoadUnits();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Unit update Successfully !!!");
       this.LoadUnits();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Unit already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }    
       
    }, error => {
      this.validationErrors = error;
    }) 
 }


 onEdit(event,cellId) {
  //console.log(cellId.rowID);  
  const ids = cellId.rowID;    
  const selectedRowData = this.sizeGrid.data.filter((record) => {
      return record.autoId == ids;
  });

 //console.log(selectedRowData);
  this.mstrUnits.get('Name').setValue(selectedRowData[0]["name"]);
  this.mstrUnits.get('AutoId').setValue(selectedRowData[0]["autoId"]);
  this.mstrUnits.get('Code').setValue(selectedRowData[0]["code"]); 
}

clearControls() {
  //this.masterColor.reset();
  this.mstrUnits.get('AutoId').setValue(0);
  this.mstrUnits.get('CreateUserId').setValue(this.user.userId);
  this.mstrUnits.get('Code').setValue("");
  this.mstrUnits.get('Name').setValue("");
}

resetControls(){
  this.mstrUnits.reset();
  this.clearControls();
  //this.clearGridRows();
}

}
