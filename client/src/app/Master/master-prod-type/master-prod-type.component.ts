import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { ProductType } from 'src/app/_models/productType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod-type',
  templateUrl: './master-prod-type.component.html',
  styleUrls: ['./master-prod-type.component.css'],
})
export class MasterProdTypeComponent implements OnInit {
  prodTypeForm: FormGroup;
  ProdTypList: ProductType[];
  user: User;
  validationErrors: string[] = [];
  CategoryList: Category[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('ProdTypGrid', { static: true })
  public ProdTypGrid: IgxGridComponent;

  @ViewChild('chkAutoArticle', { read: IgxCheckboxComponent })
  public chkAutoArticle: IgxCheckboxComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.prodTypeForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      categoryId: ['', Validators.required],
      prodTypeName: ['', [Validators.required, Validators.maxLength(50)]],
      prodTypeCode: ['', [Validators.required, Validators.maxLength(10)]],
      bAutoArticle: [false],
    });
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((cardList) => {
      this.CategoryList = cardList;
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  onSelectCategory(event) {
    for (const item of event.added) {
      this.loadProductTypes(item);
    }
  }

  loadProductTypes(catId) {
      this.masterService.getProductTypeDetils(catId).subscribe((cardList) => {
        this.ProdTypList = cardList;
      })
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };

    this.deactiveProdType(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveProdType(obj, 'Active');
  }

  deactiveProdType(obj, status) {
    var categoryId = this.prodTypeForm.get('categoryId').value[0];

    this.masterService.deactiveProductType(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Product Type ' + status + ' Successfully !!!');
          this.loadProductTypes(categoryId);
        } else if (result == 2) {
          this.toastr.success('Product Type ' + status + ' Successfully !!!');
          this.loadProductTypes(categoryId);
        } else if (result == -1) {
          this.toastr.warning('Deactive failed, already allocated !!!');
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  saveProductType() {
    var categoryId = this.prodTypeForm.get('categoryId').value[0];

    var obj = {
      createUserId: this.user.userId,
      prodTypeName: this.prodTypeForm.get('prodTypeName').value.trim(),
      prodTypeCode: this.prodTypeForm.get('prodTypeCode').value.trim(),
      autoId: this.prodTypeForm.get('autoId').value,
      categoryId: categoryId,
      bAutoArticle: this.chkAutoArticle.checked,
    };

    //console.log(obj);
    this.masterService.saveProductType(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Product Type save Successfully !!!');
          this.loadProductTypes(categoryId);
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Product Type update Successfully !!!');
          this.loadProductTypes(categoryId);
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Product Type already exists !!!');
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
    this.prodTypeForm.get('autoId').setValue(0);
    this.prodTypeForm.get('createUserId').setValue(this.user.userId);
    this.prodTypeForm.get('prodTypeName').reset();
    this.prodTypeForm.get('prodTypeCode').reset();
    this.prodTypeForm.get('bAutoArticle').reset();

    this.prodTypeForm.get('prodTypeName').enable();
    this.prodTypeForm.get('prodTypeCode').enable();
    this.prodTypeForm.get('categoryId').enable();
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.ProdTypGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.prodTypeForm.get('prodTypeName')
      .setValue(selectedRowData[0]['prodTypeName']);
    this.prodTypeForm.get('prodTypeCode')
      .setValue(selectedRowData[0]['prodTypeCode']);
    this.prodTypeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.prodTypeForm.get('bAutoArticle')
      .setValue(selectedRowData[0]['bAutoArticle']);

    this.prodTypeForm.get('categoryId').disable();
    this.prodTypeForm.get('prodTypeName').disable();
    this.prodTypeForm.get('prodTypeCode').disable();
  }
}
