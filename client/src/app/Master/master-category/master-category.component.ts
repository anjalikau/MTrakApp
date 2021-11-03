import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { Category } from 'src/app/_models/category';

@Component({
  selector: 'app-master-category',
  templateUrl: './master-category.component.html',
  styleUrls: ['./master-category.component.css']
})
export class MasterCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  CategoryList: Category[];
  user: User;
  saveobj: Category;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild("CatGrid", { static: true })
  public CatGrid: IgxGridComponent;

  constructor(private accountService: AccountService, private masterService: MasterService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCategory();
    this.initilizeForm();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCategory() {
    this.masterService.getCategory().subscribe(cardList => {
      this.CategoryList = cardList;
    })
  }

  refreshPage() {
    this.categoryForm.reset();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 120).length > 0) {
        this.saveButton = true;
      }
    }

    this.categoryForm = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Code: ['', [Validators.required, Validators.maxLength(5)]],
      Name: ['', [Validators.required, Validators.maxLength(30)]],

    })
  }

  saveCategory() {
    if(this.saveButton == true) {
    var obj = {
      "createUserId": this.user.userId,
      "code": this.categoryForm.get('Code').value.trim(),
      "name": this.categoryForm.get('Name').value.trim(),
      "autoId": this.categoryForm.get('AutoId').value
    }
    this.saveobj = Object.assign({}, obj);

    this.masterService.saveCategory(this.saveobj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Category save Successfully !!!");
        this.loadCategory();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Category update Successfully !!!");
        this.loadCategory();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Category already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    }, error => {
      this.validationErrors = error;
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.CatGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.categoryForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.categoryForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.categoryForm.get('Code').setValue(selectedRowData[0]["code"]);
  }

  clearControls() {
    this.categoryForm.get('AutoId').setValue(0);
    this.categoryForm.get('CreateUserId').setValue(this.user.userId);
    this.categoryForm.get('Code').setValue("");
    this.categoryForm.get('Name').setValue("");
  }

  resetControls() {
    this.categoryForm.reset();
    this.clearControls();
  }

}
