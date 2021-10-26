import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { FluteType } from 'src/app/_models/fluteType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-flute-type',
  templateUrl: './flute-type.component.html',
  styleUrls: ['./flute-type.component.css']
})
export class FluteTypeComponent implements OnInit {
  fluteTypeForm: FormGroup;
  fluteList: FluteType[]; 
  user: User;
  saveobj: FluteType;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('fluteTypeGrid', { static: true })
  public fluteTypeGrid: IgxGridComponent;
  
  constructor( 
    private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadFluteType();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.fluteTypeForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      code: ['', [Validators.required, Validators.maxLength(10)]],
      factor: ['', Validators.required],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadFluteType() {
    var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = user.locationId;
    this.masterService.getFluteType(locationId).subscribe((result) => {
      this.fluteList = result;
    });
  }  

  saveFluteType() {
    var loc: User = JSON.parse(localStorage.getItem('user'));
    var obj = {
      createUserId: this.user.userId,
      code: this.fluteTypeForm.get('code').value.trim(),
      factor: this.fluteTypeForm.get('factor').value,
      autoId: this.fluteTypeForm.get('autoId').value,
      locationId: loc.locationId
    };

    this.saveobj = Object.assign({}, obj);
    // console.log(this.saveobj);
    this.masterService.saveFluteType(this.saveobj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Flute Type save Successfully !!!');
          this.loadFluteType();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Flute Type update Successfully !!!');
          this.loadFluteType();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Flute Type already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Flute Type fail, already in use  !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  onEditFluteType(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.fluteTypeGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.fluteTypeForm.get('code').setValue(selectedRowData[0]['code']);
    this.fluteTypeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.fluteTypeForm.get('factor').setValue(selectedRowData[0]['factor']);
    this.fluteTypeForm.get('code').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.fluteTypeForm.get('autoId').setValue(0);
    this.fluteTypeForm.get('createUserId').setValue(this.user.userId);
    this.fluteTypeForm.get('code').setValue('');
    this.fluteTypeForm.get('factor').setValue(0);
    this.fluteTypeForm.get('code').enable();
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }

}
