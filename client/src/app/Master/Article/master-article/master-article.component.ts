import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
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
  styleUrls: ['./master-article.component.css']
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
  user: User;
  isEditMode: boolean = false;
  isProGroupSel: boolean = false;
  formTitle: string = "New Article";

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

  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;

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

  constructor(private fb: FormBuilder,
    private datePipe: DatePipe,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
    this.loadUnit();
    this.loadSizeCard();
    this.loadColorCard();
    this.loadItemType();
    this.loadCodeSettings();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    this.articleForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      stockCode: [ {value: '' , disabled: true}, [ Validators.maxLength(50)]],
      articleName: [{value: '' , disabled: true}, [ Validators.maxLength(100)]],
      description1: ['', Validators.maxLength(100)],
      description2: ['', Validators.maxLength(100)],
      categoryId: ['', Validators.required],
      proTypeId: ['', Validators.required],
      proGroupId: ['', Validators.required],
      itemType: [''],
      unitId: [''],
      measurementId: [''],      
      colorCardId: [''],
      sizeCardId: [''],
      length: [''],
      width: [''],
      height: [''],
      boardLength: [''],
      boardWidth: [''],
      rollWidth: [''],
      salesPrice: [''],
      qtyInStock: [''],
      avgCostPrice: [''],
      lastCostPrice: [''],
      maxCostPrice: [''],
      pODate: ['', Validators.required],
    });

    // this.dynamicForm = this.fb.group({
    //   fields: new FormArray([])
    // });
  }

    // // convenience getters for easy access to form fields
    // get f() { return this.dynamicForm.controls; }
    // get t() { return this.f.fields as FormArray; }

  //   loadFlexFields(item) {
  //     var obj = {
  //       categoryId: this.articleForm.get('categoryId').value[0],
  //       prodTypeId: item
  //     };

  //     console.log(obj);
  //     this.masterService.getFlexFieldCatPTWise(obj).subscribe((result) => {
  //       this.flexFieldList = result
  //       console.log(result);
        
  //       const numberOfFields = result.length || 0;
  //       if (this.t.length < numberOfFields) {
  //         for (let i = this.t.length; i < numberOfFields; i++) {

  //           var fieldName = result[i]["fieldName"];
  //           console.log(result[i]["fieldName"]);
  //           this.t.push(
  //             this.fb.group({
  //               [result[i]["fieldName"]]: ['', Validators.required] 
  //             })
  //           );
  //         }
  //       } else {
  //         for (let i = this.t.length; i >= numberOfFields; i--) {
  //           this.t.removeAt(i);
  //         }
  //       }
        
  //     });
  //     console.log      
  // }

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

  loadCodeSettings() {
    this.masterService.getCodeSettings().subscribe(result => {
        this.codeSettList = result
        // console.log(this.codeSettList);
    });    
  }

  onSelectProdGroup(event) { 
    this.articleList = [];   
    this.isProGroupSel = false;
    for (const item of event.added) {
      this.loadArticleDetails(item);
      this.isProGroupSel = true;
    }
  }
  
  loadArticleDetails(prodGroupId) {
    var articles: any[];
    var obj = {
      categoryId: this.articleForm.get('categoryId').value[0],
      proTypeId: this.articleForm.get('proTypeId').value[0],
      proGroupId: prodGroupId
    }

    // console.log(obj);
    this.masterService.getArticleDetails(obj).subscribe(result => {
      articles = result      
    }, (error) => {
      this.validationErrors = error
    } , () => {
      if (articles.length > 0) {
        for (let index = 0; index < articles.length; index++) {
          var fieldLine : any = articles[index];    
          
          ///// FILL ITEM TYPE 
          var itemType = this.itemTypeList.filter(x => x.typeId == articles[index]['itemTypeId']);
          // console.log(this.itemTypeList);
          // console.log(articles[index]['itemTypeId']);
          if(itemType.length > 0) 
            fieldLine.itemType = itemType[0]["type"]; 
          else 
            fieldLine.itemType = '';         
        }
        this.articleList = articles;
        // console.log(this.articleList);
      }
    })
  }

  loadCategory() {
    this.masterService.getCategory().subscribe(result => {
      this.categoryList = result
    });
  }


  onEditArticle(event, cellId) {
    this.clearArticleControls();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = "Update Article";
    var poDate: Date = new Date(selectedRowData[0]['poDate']);

    //console.log(selectedRowData);
    // console.log(selectedRowData[0]['poDate']);
  
    this.articleForm.get('pODate').setValue(poDate);
    this.articleForm.get('stockCode').setValue(selectedRowData[0]['stockCode']);
    this.articleForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.articleForm.get('articleName').setValue(selectedRowData[0]['articleName']);
    this.articleForm.get('description1').setValue(selectedRowData[0]['description1']);
    this.articleForm.get('description2').setValue(selectedRowData[0]['description2']);
    this.articleForm.get('avgCostPrice').setValue(selectedRowData[0]['avgCostPrice']);
    this.articleForm.get('boardLength').setValue(selectedRowData[0]['boardLength']);
    this.articleForm.get('boardWidth').setValue(selectedRowData[0]['boardWidth']);
    this.articleForm.get('height').setValue(selectedRowData[0]['height']);
    this.articleForm.get('length').setValue(selectedRowData[0]['length']);
    this.articleForm.get('width').setValue(selectedRowData[0]['width']);
    this.articleForm.get('lastCostPrice').setValue(selectedRowData[0]['lastCostPrice']);    
    this.articleForm.get('maxCostPrice').setValue(selectedRowData[0]['maxCostPrice']);
    this.articleForm.get('qtyInStock').setValue(selectedRowData[0]['qtyInStock']);
    this.articleForm.get('rollWidth').setValue(selectedRowData[0]['rollWidth']);
    this.articleForm.get('salesPrice').setValue(selectedRowData[0]['salesPrice']);      
    // this.articleForm.get('itemType').setValue(selectedRowData[0]['itemTypeId']);    
    
    this.itemType.setSelectedItem(selectedRowData[0]['itemTypeId'],true);
    this.unit.setSelectedItem(selectedRowData[0]['unitId'], true);
    this.measurement.setSelectedItem(selectedRowData[0]['measurementId'], true);
    this.colorCard.setSelectedItem(selectedRowData[0]['colorCardId'], true);
    this.sizeCard.setSelectedItem(selectedRowData[0]['sizeCardId'], true);

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

  loadProductType(catId: number){
    this.masterService.getProductTypeDetils(catId).subscribe(result => {
      this.prodTypeList = result
      //  console.log(this.prodTypeList);
    });    
  }

  onSelectProdType(event) {
    this.articleForm.get('proGroupId').reset();
    this.prodGroupList = [];
    this.articleList = [];
    for (const item of event.added) {
      this.loadProductGroup(item);     
      //this.loadFlexFields(item);
    }
  }  

  loadProductGroup(typeId: number) {   
    // console.log(typeId);     
    this.masterService.getProductGroupDt(typeId).subscribe(result => {
      this.prodGroupList = result
    })
    // console.log(this.prodGroupList); 
  }

  loadUnit() {
    this.masterService.getUnits().subscribe(result => {
      this.unitList = result
      this.measurList = result;
    });
    //console.log(this.unitList);
  }

  loadColorCard() {
    this.masterService.getColorCard().subscribe(result => {
      this.colorCardList = result
    });
    // console.log(this.colorCard);
  }

  loadSizeCard() {
    this.masterService.getSizeCard().subscribe(result => {
      this.sizeCardList = result
    })
    // console.log(this.sizeCardList);
  }

  loadItemType() {
    this.itemTypeList = [
      { type: 'Stock', typeId: 1 },
      { type: 'Non Stock', typeId: 2 },
      { type: 'Service', typeId: 3 }
    ];
  }

  validationControls() {
    var prodTypeId = this.articleForm.get('proTypeId').value;
    var prodGroupId = this.articleForm.get('proGroupId').value;
    var codeSetLine = this.codeSettList.filter(x => x.prodGroupId == prodGroupId && x.prodTypeId == prodTypeId);

    // console.log(this.articleForm.get('length').value);
    // console.log(codeSetLine);

    if (codeSetLine.length > 0) {
      if ((this.articleForm.get('length').value == null || this.articleForm.get('length').value == 0) 
          && codeSetLine[0]["isLength"] == true) {
        this.toastr.warning('Length is required');
        return false;
      } else if ((this.articleForm.get('width').value == null || this.articleForm.get('width').value == 0) 
          && codeSetLine[0]["isWidth"] == true) { 
        this.toastr.warning('Width is required');
        return false;
      } else if ((this.articleForm.get('height').value == null || this.articleForm.get('height').value == 0) 
          && codeSetLine[0]["isHeight"] == true) { 
        this.toastr.warning('Height is required');
        return false;
      }
    } else {
      this.toastr.warning('Please enter code Settings !!!');
      return false;
    }
    return true;
  }

  saveArticle() {
    if (this.validationControls()) {    
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
      unitId:
        this.articleForm.get('unitId').value == null
          ? 0
          : this.articleForm.get('unitId').value[0],
      measurementId:
        this.articleForm.get('measurementId').value == null
          ? 0
          : this.articleForm.get('measurementId').value[0],
      length:
        this.articleForm.get('length').value == null
          ? 0
          : this.articleForm.get('length').value,
      width:
        this.articleForm.get('width').value == null
          ? 0
          : this.articleForm.get('width').value,
      height:
        this.articleForm.get('height').value == null
          ? 0
          : this.articleForm.get('height').value,
      boardLength:
        this.articleForm.get('boardLength').value == null
          ? 0
          : this.articleForm.get('boardLength').value,
      boardWidth:
        this.articleForm.get('boardWidth').value == null
          ? 0
          : this.articleForm.get('boardWidth').value,
      rollWidth:
        this.articleForm.get('rollWidth').value == null
          ? 0
          : this.articleForm.get('rollWidth').value,
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
      qtyInStock:
        this.articleForm.get('qtyInStock').value == null
          ? 0
          : this.articleForm.get('qtyInStock').value,
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
          : this.articleForm.get('maxCostPrice').value,
      pODate: this.datePipe.transform(this.articleForm.get('pODate').value, 'yyyy-MM-dd'),
    };

    // console.log(this.articleForm.get('pODate').value);

    var prodGroupId = this.articleForm.get('proGroupId').value[0];
    // console.log(obj);
    this.masterService.saveArticle(obj).subscribe(
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
    this.articleForm.get('stockCode').disable();
    this.articleForm.get('articleName').disable();
    // this.articleForm.get('categoryId').disable();
    // this.articleForm.get('proTypeId').disable();
    // this.articleForm.get('proGroupId').disable();
    this.articleForm.get('length').disable();
    this.articleForm.get('width').disable();
    this.articleForm.get('height').disable();
  }

  enableArticleControls(){
    this.articleForm.get('stockCode').enable();
    this.articleForm.get('articleName').enable();
    this.articleForm.get('length').enable();
    this.articleForm.get('width').enable();
    this.articleForm.get('height').enable();
  }

  clearArticleControls() {
    this.isEditMode = false;
    this.formTitle = "New Article";

    this.articleForm.get('autoId').setValue(0);
    this.articleForm.get('pODate').reset();
    this.articleForm.get('stockCode').reset();
    this.articleForm.get('articleName').reset();
    this.articleForm.get('description1').reset();
    this.articleForm.get('description2').reset();
    this.articleForm.get('avgCostPrice').reset();
    this.articleForm.get('boardLength').reset();
    this.articleForm.get('boardWidth').reset();
    this.articleForm.get('height').reset();
    this.articleForm.get('length').reset();
    this.articleForm.get('width').reset();
    this.articleForm.get('lastCostPrice').reset();    
    this.articleForm.get('maxCostPrice').reset();
    this.articleForm.get('qtyInStock').reset();
    this.articleForm.get('rollWidth').reset();
    this.articleForm.get('salesPrice').reset();      
    this.articleForm.get('itemType').reset(); 
    
    this.articleForm.get('unitId').reset();
    this.articleForm.get('measurementId').reset();
    this.articleForm.get('colorCardId').reset();      
    this.articleForm.get('sizeCardId').reset();
    this.enableArticleControls();

    var prodTypeId = this.articleForm.get('proTypeId').value;

     ///// check article code is automatic or not 
     var selProdType = this.prodTypeList.filter(x => x.bAutoArticle == true && x.autoId == prodTypeId);
     if(selProdType.length > 0) {
       this.articleForm.get("stockCode").disable();
       this.articleForm.get("articleName").disable();
     } else {
       this.articleForm.get("stockCode").enable();
       this.articleForm.get("articleName").enable();
     }
  }

}
