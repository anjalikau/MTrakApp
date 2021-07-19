import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { SerialNo } from 'src/app/_models/serialNo';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-serialno-details',
  templateUrl: './master-serialno-details.component.html',
  styleUrls: ['./master-serialno-details.component.css'],
})
export class MasterSerialnoDetailsComponent implements OnInit {
  serialNoForm: FormGroup;
  serialNoList: SerialNo[];
  user: User;
  validationErrors: string[] = [];
  categoryList: Category[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('SerialNoGrid', { static: true })
  public SerialNoGrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
    this.loadSerialNoDetails();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.serialNoForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      prefix: ['', [Validators.required, Validators.maxLength(5)]],
      noOfDigits: ['', Validators.required],
      counter: ['', Validators.required],
    });
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((cardList) => {
      this.categoryList = cardList;
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadSerialNoDetails() {
    var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getSerialNoDetails(user.locationId).subscribe((cardList) => {
      this.serialNoList = cardList;
    });
  }


  saveSerialNo() {
    var user: User = JSON.parse(localStorage.getItem('user'));

    var obj = {
      createUserId: this.user.userId,
      name: this.serialNoForm.get('name').value.trim(),
      prefix: this.serialNoForm.get('prefix').value.trim(),
      noOfDigits: this.serialNoForm.get('noOfDigits').value,
      counter: this.serialNoForm.get('counter').value,
      autoId: this.serialNoForm.get('autoId').value,
      moduleId: 1,
      locationId: user.locationId,
    };

    this.masterService.saveSerialNoDetails(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Serial No save Successfully !!!');
          this.loadSerialNoDetails();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Serial No update Successfully !!!');
          this.loadSerialNoDetails();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Serial No already exists !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  clearControls() {
    this.serialNoForm.reset();

    this.serialNoForm.get('autoId').setValue(0);
    this.serialNoForm.get('createUserId').setValue(this.user.userId);

    this.serialNoForm.get('name').enable();
    this.serialNoForm.get('prefix').enable();
  }

 
  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.SerialNoGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.serialNoForm.get('name').setValue(selectedRowData[0]['name']);
    this.serialNoForm.get('prefix').setValue(selectedRowData[0]['prefix']);
    this.serialNoForm.get('noOfDigits').setValue(selectedRowData[0]['noOfDigits']);
    this.serialNoForm.get('counter').setValue(selectedRowData[0]['counter']);
    this.serialNoForm.get('autoId').setValue(selectedRowData[0]['autoId']);

    this.serialNoForm.get('name').disable();
    this.serialNoForm.get('prefix').disable();
  }
}
