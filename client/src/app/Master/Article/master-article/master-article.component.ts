import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { resourceUsage } from 'node:process';
import { Card } from 'src/app/_models/card';
import { Category } from 'src/app/_models/category';
import { FlexFieldValueList } from 'src/app/_models/flexFieldValueList';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { Units } from 'src/app/_models/units';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-article',
  templateUrl: './master-article.component.html',
  styleUrls: ['./master-article.component.css'],
})
export class MasterArticleComponent implements OnInit {
  articleForm: FormGroup;
  dynamicForm: FormGroup;
  categoryList: Category[];
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  colorCardList: Card[];
  sizeCardList: Card[];
  unitList: Units[];
  measurList: Units[];
  itemTypeList: any[];
  flexFieldList: any[];
  articleList: any[];
  codeSettList: any[];
  flexValueList: FlexFieldValueList[];
  flexFieldDataList: any;
  user: User;
  isEditMode: boolean = false;
  isProGroupSel: boolean = false;
  formTitle: string = 'New Article';
  numberField: boolean = false;
  textField: boolean = true;
  comboField: boolean = false;
  radioField: boolean = false;
  dateField: boolean = false;
  nameValuePairs: any[];
  rowId: number = 0;
  
  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    //timezone: 'UTC+0',
  };
  public formatDateOptions = this.dateOptions;

  //customerHdList: CustomerHd[];
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  public selected: string;

  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;
  @ViewChild('flexFieldGrid', { static: true })
  public flexFieldGrid: IgxGridComponent;

  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('prodType', { read: IgxComboComponent })
  public prodType: IgxComboComponent;
  @ViewChild('prodGroup', { read: IgxComboComponent })
  public prodGroup: IgxComboComponent;
  @ViewChild('unit', { read: IgxComboComponent })
  public unit: IgxComboComponent;
  @ViewChild('measurement', { read: IgxComboComponent })
  public measurement: IgxComboComponent;
  @ViewChild('colorCard', { read: IgxComboComponent })
  public colorCard: IgxComboComponent;
  @ViewChild('sizeCard', { read: IgxComboComponent })
  public sizeCard: IgxComboComponent;
  @ViewChild('itemType', { read: IgxComboComponent })
  public itemType: IgxComboComponent;
  @ViewChild('cmbflexFeild', { read: IgxComboComponent })
  public cmbflexFeild: IgxComboComponent;
  @ViewChild('flexFieldVal', { read: IgxComboComponent })
  public flexFieldVal: IgxComboComponent;
  
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  
 constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
    this.loadUnit();
    this.loadSizeCard();
    this.loadColorCard();
    this.loadItemType();
    // this.loadCodeSettings();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    this.articleForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      stockCode: [{ value: '', disabled: true }, [Validators.maxLength(50)]],
      articleName: [{ value: '', disabled: true }, [Validators.maxLength(100)]],
      description1: ['', Validators.maxLength(100)],
      description2: ['', Validators.maxLength(100)],
      categoryId: ['', Validators.required],
      proTypeId: ['', Validators.required],
      proGroupId: ['', Validators.required],
      itemType: [''],
      unitId: ['', Validators.required],
      measurementId: ['' , Validators.required],
      colorCardId: [''],
      sizeCardId: [''],
      salesPrice: [''],    
      avgCostPrice: [''],
      lastCostPrice: [''],
      maxCostPrice: [''],
      flexFieldName: [0],
      flexFieldVal: [''],
    });

    this.nameValuePairs = [
      { name: 'Red Color', value: 'Red' },
      { name: 'Green Color', value: 'Green' },
      { name: 'Blue Color', value: 'Blue' },
    ];
    // this.dynamicForm = this.fb.group({
    //   fields: new FormArray([])
    // });
  }

  // // convenience getters for easy access to form fields
  // get f() { return this.dynamicForm.controls; }
  // get t() { return this.f.fields as FormArray; }

  ///// LOADS FLEX FIELD BASED ON CATEGORY AND PRODUCT TYPE
  loadFlexFields(item) {
    var obj = {
      categoryId: this.articleForm.get('categoryId').value[0],
      prodTypeId: item,
    };

    // console.log(obj);
    this.masterService.getFlexFieldCatPTWise(obj).subscribe((result) => {
      this.flexFieldList = result;
      console.log(result);
    });
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  onSelectProdGroup(event) {
    this.articleList = [];
    this.isProGroupSel = false;
    for (const item of event.added) {
      this.loadArticleDetails(item);
      this.isProGroupSel = true;
    }
  }

  onSelectFlexField(event) {
    for (const item of event.added) {
      var selectField = this.flexFieldList.filter((x) => x.autoId == item);

      if (selectField[0]['valueList'] == true) {
        this.comboField = true;
        this.textField = false;
        this.numberField = false;
        this.dateField = false;
        this.radioField = false;
      } else if (selectField[0]['dataType'] == 'T') {
        this.comboField = false;
        this.textField = true;
        this.numberField = false;
        this.dateField = false;
        this.radioField = false;
      } else if ( selectField[0]['dataType'] == 'N' || selectField[0]['dataType'] == 'F') {
        this.textField = false;
        this.numberField = true;
        this.comboField = false;
        this.dateField = false;
        this.radioField = false;
      } else if (selectField[0]['dataType'] == 'D') {
        this.textField = false;
        this.numberField = false;
        this.comboField = false;
        this.dateField = true;
        this.radioField = false;
      } else if (selectField[0]['dataType'] == 'B') {
        this.textField = false;
        this.numberField = false;
        this.comboField = false;
        this.dateField = false;
        this.radioField = true;
      }
    }
  }

  loadArticleDetails(prodGroupId) {
    var articles: any[];
    var obj = {
      categoryId: this.articleForm.get('categoryId').value[0],
      proTypeId: this.articleForm.get('proTypeId').value[0],
      proGroupId: prodGroupId,
    };

    // console.log(obj);
    this.masterService.getArticleDetails(obj).subscribe(
      (result) => {
        articles = result;
      },
      (error) => {
        this.validationErrors = error;
      },
      () => {
        if (articles.length > 0) {
          var autoId = 0,
            flexLine = [];
          // console.log(articles);

          ///// Get Unique Article List
          var uniqeArticle = articles.filter(
            (arr, index, self) =>
              index === self.findIndex((t) => t.autoId === arr.autoId)
          );

          ///// PUSH ITEM TYPE IN ARTICLE LIST
          for (let b = 0; b < uniqeArticle.length; b++) {
            autoId = uniqeArticle[b]['autoId'];
            var fieldLine: any = uniqeArticle[b];

            ///// FILL ITEM TYPE
            var itemType = this.itemTypeList.filter(
              (x) => x.typeId == uniqeArticle[b]['itemTypeId']
            );

            if (itemType.length > 0) fieldLine.itemType = itemType[0]['type'];
            else fieldLine.itemType = '';

            // console.log(uniqeArticle);
            //// GET FLEX FIELD LIST FOR SAME ARTICLE
            var flexFieldList = articles.filter((x) => x.autoId == autoId);
            flexLine = [];

            //// CREATE CHILD OBJECT AS FLEX FIELD
            for (let a = 0; a < flexFieldList.length; a++) {
              const element = flexFieldList[a];
              var flexValue = 0;

              if (element['dataType'] == 'F')
                flexValue = element['fFlexFeildValue'];
              else if (element['dataType'] == 'N')
                flexValue = element['iFlexFeildValue'];
              else if (element['dataType'] == 'T')
                flexValue = element['cFlexFeildValue'];
              else if (element['dataType'] == 'B')
                flexValue = element['bFlexFeildValue'];
              else if (element['dataType'] == 'D')
                flexValue = element['dFlexFeildValue'];

              var obj = {
                dataType: element['dataType'],
                flexFieldId: element['flexFieldId'],
                flexFieldName: element['flexFieldName'],
                flexFieldCode : element['flexFieldCode'],
                flexFieldValue: flexValue,
                valueList: element['valueList'],
              };
              flexLine.push(obj);
            }

            fieldLine.FlexFields = flexLine;
          }
          this.articleList = uniqeArticle;
          // console.log(this.articleList);
        }
      }
    );
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;  
    this.dialog.open();
  }

  //// DELETE FLEX FIELD VALUE 
  public onDialogOKSelected(event) {   
    event.dialog.close();
    //console.log(this.rowId);
    if (this.rowId > 0) {
      this.flexFieldGrid.deleteRow(this.rowId);
    }
  }

  //// ADD NEW FLEX FIELD ITEM
  addFlexField() {
    var flexValue = 0, fieldCode = "";
    var flexFieldId = this.articleForm.get('flexFieldName').value[0];

    var selectedRowData = this.flexFieldGrid.data.filter((record) => {
      return record.flexFieldId == flexFieldId;
    })

    if(selectedRowData.length > 0) {
      this.toastr.warning("Field already added!!!");
    } else {
      var selectedRow = this.flexFieldList.filter(x => x.autoId == flexFieldId);

      if (selectedRow[0]['valueList'] == true) 
        flexValue = this.articleForm.get('flexFieldVal').value[0];
      else
        flexValue = this.articleForm.get('flexFieldVal').value; 
        
        var obj = {
          dataType: selectedRow[0]['dataType'],
          flexFieldId: flexFieldId,
          flexFieldCode: selectedRow[0]['flexFieldCode'],
          flexFieldName: this.cmbflexFeild.value,
          flexFieldValue: flexValue,
          valueList: selectedRow[0]['valueList'],
        };
      
      this.flexFieldGrid.addRow(obj);
    }   
    this.clearFlexFields();
  }

  clearFlexFields() {
    this.articleForm.get('flexFieldName').setValue("");
    this.articleForm.get('flexFieldVal').setValue("");
    this.textField = true;
    this.numberField = false;
    this.comboField = false;
    this.dateField = false;
    this.radioField = false;
  }

  onEditArticle(event, cellId) {
    this.clearArticleControls();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = 'Update Article';
    // var poDate: Date = new Date(selectedRowData[0]['poDate']);

    // this.articleForm.get('pODate').setValue(poDate);
    this.articleForm.get('stockCode').setValue(selectedRowData[0]['stockCode']);
    this.articleForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.articleForm
      .get('articleName')
      .setValue(selectedRowData[0]['articleName']);
    this.articleForm
      .get('description1')
      .setValue(selectedRowData[0]['description1']);
    this.articleForm
      .get('description2')
      .setValue(selectedRowData[0]['description2']);
    this.articleForm
      .get('avgCostPrice')
      .setValue(selectedRowData[0]['avgCostPrice']);
    this.articleForm
      .get('lastCostPrice')
      .setValue(selectedRowData[0]['lastCostPrice']);
    this.articleForm
      .get('maxCostPrice')
      .setValue(selectedRowData[0]['maxCostPrice']);
    this.articleForm
      .get('salesPrice')
      .setValue(selectedRowData[0]['salesPrice']);

    this.itemType.setSelectedItem(selectedRowData[0]['itemTypeId'], true);
    this.unit.setSelectedItem(selectedRowData[0]['unitId'], true);
    this.measurement.setSelectedItem(selectedRowData[0]['measurementId'], true);
    this.colorCard.setSelectedItem(selectedRowData[0]['colorCardId'], true);
    this.sizeCard.setSelectedItem(selectedRowData[0]['sizeCardId'], true);

    ///// FILL FLEX FIELD GRID
    this.flexFieldDataList = selectedRowData[0]['FlexFields'];
    /// disabled fileds
    this.disableArticleControls();
  }

  onSelectCategory(event) {
    this.articleForm.get('proTypeId').reset();
    this.articleForm.get('proGroupId').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];
    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  loadProductType(catId: number) {
    this.masterService.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
      //  console.log(this.prodTypeList);
    });
  }

  onSelectProdType(event) {
    this.articleForm.get('proGroupId').reset();
    this.prodGroupList = [];
    this.articleList = [];
    for (const item of event.added) {
      this.loadProductGroup(item);
      this.loadFlexFields(item);
    }
  }

  loadProductGroup(typeId: number) {
    // console.log(typeId);
    this.masterService.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
    // console.log(this.prodGroupList);
  }

  loadUnit() {
    this.masterService.getUnits().subscribe((result) => {
      this.unitList = result;
      this.measurList = result;
    });
    //console.log(this.unitList);
  }

  loadColorCard() {
    this.masterService.getColorCard().subscribe((result) => {
      this.colorCardList = result;
    });
    // console.log(this.colorCard);
  }

  loadSizeCard() {
    this.masterService.getSizeCard().subscribe((result) => {
      this.sizeCardList = result;
    });
    // console.log(this.sizeCardList);
  }

  loadItemType() {
    this.itemTypeList = [
      { type: 'Stock', typeId: 1 },
      { type: 'Non Stock', typeId: 2 },
      { type: 'Service', typeId: 3 },
    ];
  }

  validationControls() {
    var prodTypeId = this.articleForm.get('proTypeId').value;
    var prodGroupId = this.articleForm.get('proGroupId').value;
    ///// check article Name is automatic or not
    var selProdType = this.prodTypeList.filter(
      (x) => x.bAutoArticle == true && x.autoId == prodTypeId
    );

    ///// IF PROD TYPE CODE IS ATOMATIC
    if (selProdType.length > 0) {
      /// CHECK ALL MANDATORY FLEX FIELDS ARE ENTERED 
      var flexFieldLine = this.flexFieldList.filter(x => x.mandatory == true );

      if (flexFieldLine.length > 0) {
        for (let a = 0; a < flexFieldLine.length; a++) {
          const element = flexFieldLine[a];

          var selectedRow = this.flexFieldGrid.data.filter((record) => {
            return record.flexFieldId == element["autoId"];
          });
          
          ///// FLEX FIELD NOT IN THE LIST RETURN AN ERROR
          if(selectedRow.length == 0) {
            this.toastr.warning('Please enter mandatory fields !!!');
            return false;
          }            
        }
      } 
    }
    else {
      this.toastr.warning('Please enter Article Name !!!');
      return false;
    }
    return true;
  }

  saveArticle() {
    if (this.validationControls()) {
      var flexList = [] ;
      var bFlexFieldValue = false, dFlexFieldValue = "1990-01-01", iFlexFeildValue = 0 , fFlexFeildValue= 0
        , cFlexFeildValue = "";
      var user: User = JSON.parse(localStorage.getItem('user'));
      // console.log(this.articleForm.get('itemType').value);

      var obj = {
        createUserId: this.user.userId,
        stockCode:
          this.articleForm.get('stockCode').value == undefined
            ? ''
            : this.articleForm.get('stockCode').value.trim(),
        autoId: this.articleForm.get('autoId').value,
        articleName:
          this.articleForm.get('articleName').value == undefined
            ? ''
            : this.articleForm.get('articleName').value.trim(),
        description1:
          this.articleForm.get('description1').value == undefined
            ? ''
            : this.articleForm.get('description1').value.trim(),
        description2:
          this.articleForm.get('description2').value == undefined
            ? ''
            : this.articleForm.get('description2').value.trim(),
        categoryId:
          this.articleForm.get('categoryId').value == null
            ? 0
            : this.articleForm.get('categoryId').value[0],
        proTypeId:
          this.articleForm.get('proTypeId').value == null
            ? 0
            : this.articleForm.get('proTypeId').value[0],
        proGroupId:
          this.articleForm.get('proGroupId').value == null
            ? 0
            : this.articleForm.get('proGroupId').value[0],
        itemType:
          this.articleForm.get('itemType').value == null
            ? 0
            : this.articleForm.get('itemType').value[0],
        storageUnitId:
          this.articleForm.get('unitId').value == null
            ? 0
            : this.articleForm.get('unitId').value[0],
        measurementId:
          this.articleForm.get('measurementId').value == null
            ? 0
            : this.articleForm.get('measurementId').value[0],
        colorCardId:
          this.articleForm.get('colorCardId').value == null
            ? 0
            : this.articleForm.get('colorCardId').value[0],
        sizeCardId:
          this.articleForm.get('sizeCardId').value == null
            ? 0
            : this.articleForm.get('sizeCardId').value[0],
        salesPrice:
          this.articleForm.get('salesPrice').value == null
            ? 0
            : this.articleForm.get('salesPrice').value,       
        avgCostPrice:
          this.articleForm.get('avgCostPrice').value == null
            ? 0
            : this.articleForm.get('avgCostPrice').value,
        lastCostPrice:
          this.articleForm.get('lastCostPrice').value == null
            ? 0
            : this.articleForm.get('lastCostPrice').value,
        maxCostPrice:
          this.articleForm.get('maxCostPrice').value == null
            ? 0
            : this.articleForm.get('maxCostPrice').value       
      };

      ////// ---------============= FLEX FIELD GRID DETAILS ==============------------------
      var itemRows = this.flexFieldGrid.data;

      itemRows.forEach((items) => {
        if (items.dataType == "B")
          bFlexFieldValue = items.flexFieldValue == "true" ? true : false;
        else if (items.dataType == "D")
          dFlexFieldValue = items.flexFieldValue;
        else if (items.dataType == "N" || items.valueList == true)
          iFlexFeildValue = parseInt(items.flexFieldValue);
        else if (items.dataType == "F")
          fFlexFeildValue = parseFloat(items.flexFieldValue);
        else if (items.dataType == "S")
          cFlexFeildValue = items.flexFieldValue;

        var itemdata = {
          flexFieldId: items.flexFieldId,
          flexFieldName: items.flexFieldName,
          flexFieldCode: items.flexFieldCode,
          dataType: items.dataType,
          valueList: items.valueList,
          bFlexFieldValue: bFlexFieldValue == undefined ? 0 : bFlexFieldValue,
          dFlexFieldValue: dFlexFieldValue,
          iFlexFeildValue: iFlexFeildValue == undefined ? 0 : iFlexFeildValue,
          fFlexFeildValue: fFlexFeildValue == undefined ? 0 : fFlexFeildValue,
          cFlexFeildValue: cFlexFeildValue == undefined ? 0 : cFlexFeildValue
        };
        flexList.push(itemdata);
      });

      var artiObj = {
        flexField : flexList,
        article: obj
      }

      // console.log(this.articleForm.get('pODate').value);
      var prodGroupId = this.articleForm.get('proGroupId').value[0];
      console.log(artiObj);
      this.masterService.saveArticle(artiObj).subscribe(
        (result) => {
          //console.log(result);
          if (result['result'] == 1) {
            this.toastr.success('Article save successfully !!!');
            this.articleForm.get('autoId').setValue(result['autoId']);
            this.articleForm.get('stockCode').setValue(result['stockCode']);
            this.articleForm.get('articleName').setValue(result['articleName']);
            this.disableArticleControls();
            this.loadArticleDetails(prodGroupId);
            this.clearArticleControls();
          } else if (result['result'] == 2) {
            this.toastr.success('Article update successfully !!!');
            this.loadArticleDetails(prodGroupId);
          } else if (result['result'] == -1) {
            this.toastr.warning('Article already exists !!!');
          } else if (result['result'] == -3) {
            this.toastr.warning('Code Settings not found !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result['result'].toString()
            );
          }
        },
        (error) => {
          this.validationErrors = error;
        }
      );
    }
  }

  disableArticleControls() {
    this.articleForm.get('unitId').disable();
    this.articleForm.get('measurementId').disable();
    this.articleForm.get('articleName').disable();
  }

  enableArticleControls() {
    this.articleForm.get('unitId').enable();
    this.articleForm.get('measurementId').enable();
    this.articleForm.get('articleName').enable();
  }

  clearArticleControls() {
    this.isEditMode = false;
    this.formTitle = 'New Article';

    this.articleForm.get('autoId').setValue(0);
    // this.articleForm.get('pODate').reset();
    this.articleForm.get('stockCode').reset();
    this.articleForm.get('articleName').reset();
    this.articleForm.get('description1').reset();
    this.articleForm.get('description2').reset();
    this.articleForm.get('avgCostPrice').reset();
    // this.articleForm.get('gsm').reset();
    // this.articleForm.get('boardWidth').reset();
    // this.articleForm.get('height').reset();
    // this.articleForm.get('length').reset();
    // this.articleForm.get('width').reset();
    this.articleForm.get('lastCostPrice').reset();
    this.articleForm.get('maxCostPrice').reset();
    // this.articleForm.get('qtyInStock').reset();
    // this.articleForm.get('rollWidth').reset();
    this.articleForm.get('salesPrice').reset();
    this.articleForm.get('itemType').reset();

    this.articleForm.get('unitId').reset();
    this.articleForm.get('measurementId').reset();
    this.articleForm.get('colorCardId').reset();
    this.articleForm.get('sizeCardId').reset();
    this.enableArticleControls();

    var prodTypeId = this.articleForm.get('proTypeId').value;

    ///// check article code is automatic or not
    var selProdType = this.prodTypeList.filter(
      (x) => x.bAutoArticle == true && x.autoId == prodTypeId
    );
    if (selProdType.length > 0) {
      // this.articleForm.get('stockCode').disable();
      this.articleForm.get('articleName').disable();
    } else {
      // this.articleForm.get('stockCode').enable();
      this.articleForm.get('articleName').enable();
    }
  }
}
