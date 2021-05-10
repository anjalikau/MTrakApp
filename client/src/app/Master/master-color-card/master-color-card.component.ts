import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MasterCard } from 'src/app/_models/masterCard';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-color-card',
  templateUrl: './master-color-card.component.html',
  styleUrls: ['./master-color-card.component.css']
})
export class MasterColorCardComponent implements OnInit {
  MstrColorCrd: FormGroup;
  user: User;
  CCardList: MasterCard[];
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("MstrCCgrid", { static: true }) 
  public MstrCCgrid: IgxGridComponent;
  //public event: EventEmitter<any> = new EventEmitter();
  
  constructor(private fb: FormBuilder, private accountService: AccountService, private masterService: MasterService
      , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.LoadColorCard();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.MstrColorCrd = this.fb.group ({
      AutoId : [0],
      CreateUserId : this.user.userId,
      Name: ['', [Validators.required , Validators.maxLength(50)]]
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  LoadColorCard(){
    this.masterService.getColorCard().subscribe(cardList => {
      this.CCardList = cardList;
    })
  }

  SaveColorCard() {    
    this.masterService.saveColorCard(this.MstrColorCrd.value).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Color Card save Successfully !!!");
        this.LoadColorCard();
        this.cancelMenuList();
      } else if (result == 2) {
        this.toastr.success("Color Card update Successfully !!!");
        this.LoadColorCard();
        this.cancelMenuList();
      } else if (result == -1) {
        this.toastr.warning("Color Card already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      } 
      //this.triggerEvent();      
    }, error => {
      this.validationErrors = error;
    }) 
  }

  cancelMenuList() {
    this.MstrColorCrd.reset();
    //this.MstrColorCrd.get('Name').setValue("");
    this.MstrColorCrd.get('AutoId').setValue(0);
    this.MstrColorCrd.get('CreateUserId').setValue(this.user.userId);
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL 
  onEdit(event,cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;    
    const selectedRowData = this.MstrCCgrid.data.filter((record) => {
        return record.autoId == ids;
    });    
   
    this.MstrColorCrd.get('Name').setValue(selectedRowData[0]["name"]);
    this.MstrColorCrd.get('AutoId').setValue(selectedRowData[0]["autoId"]);
  }

}
