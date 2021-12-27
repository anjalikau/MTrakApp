import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSortingStrategy, IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent, IgxHierarchicalGridComponent, IgxInputGroupComponent, IgxNumberSummaryOperand, IgxRowIslandComponent, IgxSummaryResult, ISortingExpression, SortingDirection } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { BrandCode } from 'src/app/_models/brandCode';
import { Category } from 'src/app/_models/category';
import { Color } from 'src/app/_models/color';
import { CostingGroup } from 'src/app/_models/costingGroup';
import { CustomerHd } from 'src/app/_models/customerHd';
import { FluteType } from 'src/app/_models/fluteType';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { Size } from 'src/app/_models/size';
import { SpecialInstruction } from 'src/app/_models/specialInstruction';
import { UnitConversion } from 'src/app/_models/unitConversion';
import { Units } from 'src/app/_models/units';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

class SumSummary {
  public operate(data?: any[]): IgxSummaryResult[] {
      // console.log(data);
      const result = [];
      result.push({
          key: 'sum',
          label: 'Sum',
          summaryResult: IgxNumberSummaryOperand.sum(data).toFixed(4)
      });
      // console.log(result);
      return result;
  }
}

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  styleUrls: ['./costing.component.css'],
})
export class CostingComponent implements OnInit {
  costingHdForm: FormGroup;
  brandSelForm: FormGroup;
  articleSelForm: FormGroup;
  specInsForm: FormGroup;
  baseMatForm: FormGroup;
  costListForm: FormGroup;
  subTotalForm: FormGroup;
  articleList: Article[];
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  categoryList: Category[];
  brandList: any[];
  unitConvList: UnitConversion[];
  specialInsList: SpecialInstruction[];
  prodDefiDetails: ProdDefinition[];
  articleConList: any[];
  instructList: any[];
  prodDefintionList: any[];
  UnitList: Units[];
  brandCodeList: BrandCode[];
  colorList: Color[];
  sizeList: Size[];
  mcolorList: Color[];
  msizeList: Size[];
  fluteTypeList: FluteType[];
  valueList: any[];
  costGroupList: CostingGroup[];
  costPriceList: any[];
  combinList: any[];
  baseList: any[];
  unitList: Units[];
  soItemList: any[];
  costNumberList = [];
  user: User;
  customerList: CustomerHd[];
  isArtiHdSel: boolean = false;
  rowId: number = 0;
  measurement: string = ' ';
  length: number = 0;
  width: number = 0;
  height: number = 0;
  boardLength: number = 0;
  boardWidth: number = 0;
  tollerence: number = 0;
  sqm: number = 0;
  actualReal: number = 0;
  reelSize: number = 0;
  trimWaste: number = 0;
  ups: number = 0;
  expectedQty: number = 0;
  grossWeight: number = 0;
  netWeight: number = 0;
  mSelColor: number = 0;
  mSelSize: number = 0;
  costPrice: number = 0;
  headerColor: number = 0;
  headerSize: number = 0;
  btnStatus: string = '';
  isActive: boolean = true;
  saveButton: boolean = false;
  printButton: boolean = false;
  validationErrors: string[] = [];
  allArticleList: any[];
  isDisplayMode: boolean = false;
  // totCostBox: number = 0;
  // totCostMOQ: number = 0;
  // profitMarkup: number = 0;
  // sellPrice: number = 0;
  // priceComm: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  public costDetailsList: any[];
  public expr: ISortingExpression[];
  public exprCost: ISortingExpression[];
  public sumSummary = SumSummary;
  public date: Date = new Date(Date.now());

  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;
  @ViewChild('brandCodeGrid', { static: true })
  public brandCodeGrid: IgxGridComponent;
  @ViewChild('costListGrid', { static: true })
  public costListGrid: IgxGridComponent;
  @ViewChild('costDtGrid', { static: true })
  public costDtGrid: IgxGridComponent;
  @ViewChild('prodDefiGrid', { static: true })
  public prodDefiGrid: IgxGridComponent;
  @ViewChild('specInstGrid', { static: true })
  public specInstGrid: IgxGridComponent;

  @ViewChild('txtArticle', { read: IgxInputGroupComponent })
  public txtArticle: IgxInputGroupComponent;

  @ViewChild('article', { read: IgxComboComponent })
  public article: IgxComboComponent;
  @ViewChild('item', { read: IgxComboComponent })
  public item: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;
  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('costGroup', { read: IgxComboComponent })
  public costGroup: IgxComboComponent;
  @ViewChild('fluteType', { read: IgxComboComponent })
  public fluteType: IgxComboComponent;
  @ViewChild('mColor', { read: IgxComboComponent })
  public mColor: IgxComboComponent;
  @ViewChild('mSize', { read: IgxComboComponent })
  public mSize: IgxComboComponent;
  @ViewChild('uom', { read: IgxComboComponent })
  public uom: IgxComboComponent;
  @ViewChild('cmbbrand', { read: IgxComboComponent })
  public cmbbrand: IgxComboComponent;
  @ViewChild('cmbbrandcode', { read: IgxComboComponent })
  public cmbbrandcode: IgxComboComponent;
  @ViewChild('cost', { read: IgxComboComponent })
  public cost: IgxComboComponent;
  @ViewChild('base', { read: IgxComboComponent })
  public base: IgxComboComponent;
  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('prodType', { read: IgxComboComponent })
  public prodType: IgxComboComponent;
  @ViewChild('prodGroup', { read: IgxComboComponent })
  public prodGroup: IgxComboComponent;
  @ViewChild('prodDefintion', { read: IgxComboComponent })
  public prodDefintion: IgxComboComponent;
  @ViewChild('specInst', { read: IgxComboComponent })
  public specInst: IgxComboComponent;
  @ViewChild('value', { read: IgxComboComponent })
  public value: IgxComboComponent;

  @ViewChild('articleForm', { read: IgxDialogComponent })
  public articleForm: IgxDialogComponent;
  @ViewChild('brandCodeForm', { read: IgxDialogComponent })
  public brandCodeForm: IgxDialogComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  //// FORMAT PRICE
  public options = {
    digitsInfo: '1.4-4',
    currencyCode: '',
  };
  public formatPrice = this.options;

  //// FORMAT NUMBER
  public options1 = {
    digitsInfo: '1.4-4',
    currencyCode: '',
  };
  public formatNumber = this.options1;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    // timezone: 'UTC+0',
  };

  public formatDateOptions = this.dateOptions;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getCostRefNo();
    this.loadCustomer();
    this.loadCategory();
    this.loadSpecialInstruction();
    this.loadProductDefinition();
    this.loadUnitConversion();
    this.loadSpeInsValues();
    this.loadFluteType();
    this.loadCostingGroup();
    this.loadUnits();
    this.loadBaseList();
    this.loadArticle();

    /// INITILIZE GRID GROUP EXPRESSION
    this.expr = [
      {
        dir: SortingDirection.Asc,
        fieldName: 'costGroup',
        ignoreCase: false,
        strategy: DefaultSortingStrategy.instance(),
      },
    ];

    /// INITILIZE GRID GROUP EXPRESSION FOR COST LIST
    this.exprCost = [
      {
        dir: SortingDirection.Asc,
        fieldName: 'refNo',
        ignoreCase: false,
        strategy: DefaultSortingStrategy.instance(),
      },
    ];

    this.costListGrid.sortingExpressions = [
      { fieldName: 'versionControl', dir: SortingDirection.Asc },
    ];
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 166).length > 0) {
        this.saveButton = true;
      }  if (authMenus.filter((x) => x.autoIdx == 1176).length > 0) {
        this.printButton = true;
      }
    }

    this.costingHdForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      refNo: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(20)],
      ],
      customerId: ['', Validators.required],
      // articleId: ['', Validators.required],
      articleName: [{ value: '' }], //, disabled: true
      articleCode: [{ value: '', disabled: true }],
      tollerence: [0, Validators.required],
      brandCodeId: [0, Validators.required],
      brandCode: [{ value: '', disabled: true }],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      combination: [{ value: '', disabled: true }, Validators.maxLength(30)],
      versionControl: [{ value: 0, disabled: true }],
      trnsDate: [{ value: date, disabled: true }],
      totCostBox: [0],
      moqCost: [0],
      totCostMoq: [0],
      markup: [0],
      profitMarkup: [0],
      sellPrice: [0],
      commission: [0],
      sellPriceCom: [0],
      isActive: [{ value: 'Active', disabled: true }],
    });

    this.brandSelForm = this.fb.group({
      brand: ['', Validators.required],
    });

    this.articleSelForm = this.fb.group({
      category: ['', Validators.required],
      prodType: ['', Validators.required],
      prodGroup: ['', Validators.required],
    });

    this.specInsForm = this.fb.group({
      prodDefinition: [''],
      specialInst: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.subTotalForm = this.fb.group({
      totCostBox: [{ value: 0, disabled: true }],
      moqCost: [0],
      totCostMoq: [{ value: 0, disabled: true }],
      markup: [0],
      profitMarkup: [{ value: 0, disabled: true }],
      sellPrice: [{ value: 0, disabled: true }],
      commission: [0],
      sellPriceCom: [{ value: 0, disabled: true }],
    });

    this.baseMatForm = this.fb.group({
      autoId: [0],
      costGroup: ['', Validators.required],
      article: [{ value: '' }, Validators.required], //, disabled: true
      gsm: [0],
      color: [''],
      size: [''],
      // articleId: [0],
      fluteType: [''],
      factor: [0],
      base: [''],
      // consBase: [{value:'', disabled:true} , Validators.required],
      uom: ['', Validators.required],
      westage: [0],
      cost: [0],
    });

    this.costListForm = this.fb.group({
      customergId: [0],
    });
  }

  loadArticle() {
    this.allArticleList = [];
    var articles = [];
    // console.log(this.user);

    var location = this.user.locations;
    var company = location.filter((x) => x.isDefault == true);
    var companyId = company[0]['companyId'];
    // console.log(companyId);

    this.masterServices.getCompArticleAll(companyId).subscribe(
      (result) => {
        // this.allArticleList = result;
        articles = result;
      },
      (error) => {
        this.validationErrors = error;
      },
      () => {
        if (articles.length > 0) {
          this.processArticleData(articles, 'A');
        }
      }
    );
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  /// GENERATE COST REFERANCE NO
  getCostRefNo() {
    this.costingHdForm.get('refNo').setValue('');
    this.salesOrderServices.getRefNumber('CostingNo').subscribe((res) => {
      //console.log(refNo);
      this.costingHdForm.get('refNo').setValue(res.refNo.toString());
    });
  }

  //// CUSTOMER ON CLICK EVENT IN LIST OF COSTING MODAL
  onViewCustomerSelect(event) {
    for (const item of event.added) {
      this.loadCostHeaderList(item);
    }
  }

  loadCostHeaderList(customerId) {
    this.salesOrderServices.getCostHeaderList(customerId).subscribe((result) => {
        this.costNumberList = result;
        // console.log(this.costNumberList);
      });
  }

  //// LOADS SPECIAL INSTRUCTIONS
  loadSpecialInstruction() {
    this.masterServices.getSpecialInstruction().subscribe((result) => {
      this.specialInsList = result;
    });
  }

  //// LOADS CATEGORY
  loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  loadProductDefinition() {
    this.prodDefiDetails = [];
    this.masterServices.getProductDefinitionList().subscribe((result) => {
      this.prodDefintionList = result;
      // console.log(result);
    });
  }

  loadProductType(catId: number) {
    this.masterServices.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
      //  console.log(this.prodTypeList);
    });
  }

  loadProductGroup(typeId: number) {
    // console.log(typeId);
    this.masterServices.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
    // console.log(this.prodGroupList);
  }

  onSelProdDefinition(event) {
    this.prodDefiDetails = [];
    for (const item of event.added) {
      this.masterServices.getProductDefinitionDt(item).subscribe((result) => {
        this.prodDefiDetails = result;
      });
    }
  }

  onSelectCategory(event) {
    this.articleSelForm.get('prodType').reset();
    this.articleSelForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  onSelectProdType(event) {
    this.articleSelForm.get('prodGroup').reset();
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductGroup(item);
      //this.loadFlexFields(item);
    }
  }

  //// LOADS ARTICLES BASED ON CATEGORY , PROD TYPE AND GROUP
  onSelectProdGroup(event) {
    this.articleList = [];
    var articles: any[];
    for (const item of event.added) {
      var obj = {
        categoryId: this.articleSelForm.get('category').value[0],
        proTypeId: this.articleSelForm.get('prodType').value[0],
        proGroupId: item,
      };
      //console.log(obj);
      this.masterServices.getArticleDetails(obj).subscribe(
        (result) => {
          articles = result;
        },
        (error) => {
          this.validationErrors = error;
        },
        () => {
          if (articles.length > 0) {
            this.processArticleData(articles, 'S');
          }
        }
      );
    }
  }

  processArticleData(articleDet, status) {
    var autoId = 0,
      flexLine = [];
    // console.log(articles);

    ///// Get Unique Article List
    var uniqeArticle = articleDet.filter(
      (arr, index, self) =>
        index === self.findIndex((t) => t.autoId === arr.autoId)
    );

    ///// PUSH FLEX FIELD ARTICLE LIST
    for (let b = 0; b < uniqeArticle.length; b++) {
      autoId = uniqeArticle[b]['autoId'];
      var fieldLine: any = uniqeArticle[b];

      // console.log(uniqeArticle);
      //// GET FLEX FIELD LIST FOR SAME ARTICLE
      var flexFieldList = articleDet.filter((x) => x.autoId == autoId);
      flexLine = [];

      //// CREATE CHILD OBJECT AS FLEX FIELD
      for (let a = 0; a < flexFieldList.length; a++) {
        const element = flexFieldList[a];
        var flexValue = 0;

        if (element['dataType'] == 'F') flexValue = element['fFlexFeildValue'];
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
          flexFieldCode: element['flexFieldCode'],
          flexFieldValue: flexValue,
          valueList: element['valueList'],
        };
        flexLine.push(obj);
      }

      fieldLine.FlexFields = flexLine;
    }
    if (status == 'S') this.articleList = uniqeArticle;
    else if (status == 'A') this.allArticleList = uniqeArticle;
    // console.log(this.articleList); && x.sizeCardId > 0 && x.colorCardId > 0
  }

  loadSpeInsValues() {
    this.valueList = [
      { name: 'Yes' },
      { name: 'No' },
      { name: 'Out Site' },
      { name: 'In Site' },
    ];
  }

  /// LOADS BASE LIST
  loadBaseList() {
    this.baseList = [
      { name: 'SQM' },
      { name: 'Gross Weight' },
      { name: 'Net Weight' },
    ];
  }

  //// LOADS ALL THE UNITS
  loadUnits() {
    this.masterServices.getUnits().subscribe((result) => {
      this.unitList = result;
    });
  }

  /// GET UNIT CONVERSION DETAILS
  loadUnitConversion() {
    this.masterServices.getUnitConversion().subscribe((result) => {
      this.unitConvList = result;
    });
  }

  loadFluteType() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    var locationId = this.user.locationId;
    this.masterServices.getFluteType(locationId).subscribe((result) => {
      this.fluteTypeList = result;
    });
  }

  loadCostingGroup() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    var locationId = this.user.locationId;
    this.masterServices.getCostingGroup(locationId).subscribe((result) => {
      this.costGroupList = result;
    });
  }

  loadCustomer() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
    });
  }

  openArticleDialog(select) {
    // console.log(select);
    this.articleGrid.deselectAllRows();
    this.articleGrid.clearFilter();
    this.articleSelForm.get('category').setValue('');
    this.articleSelForm.get('prodType').setValue('');
    this.articleSelForm.get('prodGroup').setValue('');
    this.articleList = [];
    this.isArtiHdSel = select;
    this.articleForm.open();
  }

  loadCustomerBrand() {
    var customerId = this.costingHdForm.get('customerId').value[0];
    this.brandList = [];
    this.brandCodeList = [];

    this.masterServices.getCustomerBrand(customerId).subscribe((result) => {
      this.brandList = result;
      this.brandCodeForm.open();
      // console.log(this.brandList);
    });
  }

  ///// loads brand code
  loadBrandCode(event) {
    this.brandCodeList = [];
    for (const item of event.added) {
      this.masterServices.getBrandCode(item).subscribe((result) => {
        this.brandCodeList = result;
        // console.log(this.brandCodeList);
      });
    }
  }

  //// fill factor based on flute type
  onSelectFluteType(event) {
    this.baseMatForm.get('factor').setValue(0);
    for (const item of event.added) {
      // console.log(item);
      var selectRow = this.fluteTypeList.filter((x) => x.autoId == item);
      // console.log(selectRow);
      this.baseMatForm.get('factor').setValue(selectRow[0]['factor']);
    }
  }

  onSelectDtArticle(event) {
    this.isArtiHdSel = false;
    this.mcolorList = [];
    this.msizeList = [];
    this.baseMatForm.get('gsm').setValue(0);
    this.baseMatForm.get('color').setValue('');
    this.baseMatForm.get('size').setValue('');
    this.baseMatForm.get('cost').setValue(0);

    for (const item of event.added) {
      var selectedRowData = this.allArticleList.filter((x) => x.autoId == item);
      // console.log(selectedRowData);
      this.onChangeDetailArticle(selectedRowData);
    }
  }

  onSelectHdArticle(event) {
    this.isArtiHdSel = true;
    this.clearHeaderArticle();
    this.clearBoarderDetails();
    this.clearSubTotalControls();
    //// RESET FIELDS IN COST DETAILS
    this.resetCostDetails();

    for (const item of event.added) {
      var selectedRowData = this.allArticleList.filter((x) => x.autoId == item );
      // console.log(selectedRowData);
      this.onChangeHeadArticle(selectedRowData);
    }
  }

  onChangeHeadArticle(selectedRowData) {
    // console.log(selectedRowData);
    var articleId = selectedRowData[0]['autoId'];
    this.costingHdForm
      .get('articleCode')
      .setValue(selectedRowData[0]['stockCode']);
    this.measurement = selectedRowData[0]['measurement'];

    ///// GET FLEX FIELDS DETAILS
    var flexFieldsDt = selectedRowData[0]['FlexFields'];
    for (let a = 0; a < flexFieldsDt.length; a++) {
      const element = flexFieldsDt[a];

      if (element['flexFieldName'] == 'Length')
        this.length = element['flexFieldValue'];
      else if (element['flexFieldName'] == 'Width')
        this.width = element['flexFieldValue'];
      else if (element['flexFieldName'] == 'Height')
        this.height = element['flexFieldValue'];
    }

    this.loadColor(articleId);
    this.loadSize(articleId);
    this.calculateCostHeader();
    this.articleGrid.deselectAllRows();
    this.articleForm.close();
  }

  onChangeDetailArticle(selectedRowData) {
    var articleId = selectedRowData[0]['autoId'];

    // this.baseMatForm.get('articleId').setValue(selectedRowData[0]['autoId']);
    // this.baseMatForm.get('article').setValue(selectedRowData[0]['articleName']);
    // this.baseMatForm.get('gsm').setValue(selectedRowData[0]['gsm']);

    ///// GET FLEX FIELDS DETAILS
    var flexFieldsDt = selectedRowData[0]['FlexFields'];
    for (let a = 0; a < flexFieldsDt.length; a++) {
      const element = flexFieldsDt[a];

      if (element['flexFieldName'] == 'GSM') {
        this.baseMatForm.get('gsm').setValue(element['flexFieldValue']);
      }
    }

    this.baseMatForm.get('cost').setValue(selectedRowData[0]['salesPrice']);
    // this.loadCostPrice(selectedRowData[0]['autoId']);
    this.loadArticleUOMConversion(selectedRowData[0]['autoId']);

    this.loadColor(articleId);
    this.loadSize(articleId);
    this.articleGrid.deselectAllRows();
    this.articleForm.close();
  }

  //// SELECT ARTICLE FROM ARTICLE LIST
  selectArticle(event, cellId) {
    /// CLEAR CONTROLS AND GRIDS
    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });
    // var articleId = selectedRowData[0]['autoId'];
    if (this.isArtiHdSel == true) {
      // console.log(selectedRowData);

      this.clearHeaderArticle();
      this.clearBoarderDetails();
      this.clearSubTotalControls();

      this.article.setSelectedItem(selectedRowData[0]['autoId'], true);
      this.onChangeHeadArticle(selectedRowData);

    } else {
      this.mcolorList = [];
      this.msizeList = [];
      this.baseMatForm.get('gsm').setValue(0);
      this.baseMatForm.get('color').setValue('');
      this.baseMatForm.get('size').setValue('');
      this.baseMatForm.get('cost').setValue(0);

      this.baseMatForm.get('article').setValue('');
      this.item.setSelectedItem(selectedRowData[0]['autoId'], true);
      this.onChangeDetailArticle(selectedRowData);
    }
  }

  clearHeaderArticle() {
    // // this.costingHdForm.get('articleId').setValue(0);
    this.costingHdForm.get('articleName').reset();
    this.costingHdForm.get('articleCode').reset();
    this.costingHdForm.get('tollerence').setValue(0);
    this.costingHdForm.get('colorId').setValue(0);
    this.costingHdForm.get('sizeId').setValue(0);

    // this.costDetailsList = [];
    this.colorList = [];
    this.sizeList = [];

    this.measurement = '';
    this.length = 0;
    this.width = 0;
    this.height = 0;
    this.expectedQty = 0;
    this.netWeight = 0;
    this.grossWeight = 0;
  }

  //// fill article price list
  // loadCostPrice(articleId) {
  //   var rowdata: any;
  //   this.masterServices.getArticlePrices(articleId).subscribe((result) => {
  //     //console.log(result);
  //     rowdata = result;
  //     //console.log(articleId);
  //     var uniqeNames = [
  //       'avgCostPrice',
  //       'lastCostPrice',
  //       'maxCostPrice',
  //       'salesPrice',
  //     ];
  //     var uniqeValues = [];
  //     this.costPriceList = [];

  //     /// GET UNIQUE VALUE LIST
  //     for (var i = 0; i < uniqeNames.length; i++) {
  //       if (uniqeValues.indexOf(rowdata[uniqeNames[i]]) === -1) {
  //         uniqeValues.push(rowdata[uniqeNames[i]]);
  //         this.costPriceList.push({ price: rowdata[uniqeNames[i]] });
  //       }
  //     }
  //   });
  // }

  //// LOADS UOM CONVERSION BASED ON ARTICLE
  loadArticleUOMConversion(articleId) {
    this.masterServices
      .getArticleUOMConversion(articleId)
      .subscribe((result) => {
        this.articleConList = result;
      });
  }

  loadColor(articleId) {
    // console.log("dfsdg");
    this.masterServices.getArticleColor(articleId).subscribe((color) => {
      //// check the selection
      // console.log(color);
      if (this.isArtiHdSel == true) {
        this.colorList = [];
        this.colorList = color;
      } else {
        this.mcolorList = [];
        this.mcolorList = color;
      }
      
    });
  }

  loadSize(articleId) {
    this.masterServices.getArticleSize(articleId).subscribe((size) => {
      //// check the selection
      if (this.isArtiHdSel == true) {
        this.sizeList = [];
        this.sizeList = size;
      } else {
        this.msizeList = [];
        this.msizeList = size;
      }
    });
  }

  //// SELECT BRAND CODE FROM BRAND CODE LIST
  selectBrandCode(event, cellId) {
    /// CLEAR CONTROLS AND GRIDS
    const ids = cellId.rowID;
    const selectedRowData = this.brandCodeGrid.data.filter((record) => {
      return record.autoId == ids;
    });
    //console.log(selectedRowData);
    this.costingHdForm
      .get('brandCodeId')
      .setValue(selectedRowData[0]['autoId']);
    this.costingHdForm.get('brandCode').setValue(selectedRowData[0]['name']);

    this.brandCodeForm.close();
  }

  /// tollerance lost focus event
  onFocusOutEvent(event) {
    this.calculateCostHeader();
    // console.log("c");
  }

  /// TOLLERENCE KEY UP EVENT PRESSED
  onTollerenceKey(event) {
    if (event.keyCode != 13) {
      // console.log("b");
      this.calculateCostHeader();
    } else {
      // console.log("a");
    }
  }

  ///// MOQ COST KEY UP EVENT PRESSED
  onMoqCostKey(event) {
    if (event.keyCode != 13) {
      this.calculateSubTotal();
    } else {
    }
  }

  /// MARKUP KEY UP EVENT
  onMarkupKey(event) {
    if (event.keyCode != 13) {
      this.calculateSubTotal();
    } else {
    }
  }

  // COMMISSION KEY UP
  onCommissionKey(event) {
    if (event.keyCode != 13) {
      this.calculateSubTotal();
    } else {
    }
  }

  /// on add special instruction
  onAddSpecInstruction() {
    var specInstId = this.specInsForm.get('specialInst').value[0];
    var value = this.specInsForm.get('value').value[0];
    const selectedRowData = this.specInstGrid.data.filter((record) => {
      return record.autoId == specInstId;
    });

    if (selectedRowData.length > 0) {
      this.specInstGrid.updateCell(value, specInstId, 'value');
      // this.toastr.warning("instruction already exists !!!");
    } else {
      var obj = {
        autoId: specInstId,
        description: this.specInst.value,
        value: value,
      };

      this.specInstGrid.addRow(obj);
      this.clearSpecInstruction();
    }
  }

  /// on edit specia; instruction loads details
  // onEditSpecInstruct(event, cellId) {
  //   const ids = cellId.rowID;

  //   const selectedRowData = this.specInstGrid.data.filter((record) => {
  //     return record.autoId == ids;
  //   });
  //   console.log(selectedRowData);

  //   this.specInst.setSelectedItem(selectedRowData[0]["autoId"], true);
  //   this.value.setSelectedItem(selectedRowData[0]["value"],true);
  // }

  /// clear special instruction
  clearSpecInstruction() {
    this.specInsForm.get('value').reset();
    this.specInsForm.get('specialInst').reset();
    // this.specInsForm.get('prodDefinition').setValue("");
  }

  //// OPEN DELETE CONFIRMATION DIALOG SPEC INSTRUCTION
  openSpeInstDialog(event, cellId) {
    this.btnStatus = 'I';
    this.rowId = cellId.rowID;
    this.dialog.open();
  }

  //// OPEN DELETE CONFIRMATION DIALOG COST DEFINTION
  openCostDetDialog(event, cellId) {
    this.btnStatus = 'C';
    this.rowId = cellId.rowID;
    this.dialog.open();
  }

  //// DELETE EVENT
  onDialogOKSelected(event) {
    event.dialog.close();
    var ids = this.rowId;

    if (this.btnStatus == 'I') {
      this.specInstGrid.deleteRow(ids);
    } else if (this.btnStatus == 'C') {
      //// GET ROW DETAILS OF SELECTED ROW
      const selectedRowData = this.costDtGrid.data.filter((record) => {
        return record.autoId == ids;
      });

      var costGroup = selectedRowData[0]['costGroup'];
      var costGroupId = selectedRowData[0]['costGroupId'];

      //// DELETE SELECTED ROW
      this.costDtGrid.deleteRow(ids);

      //// CALCULATE ONLY IF BASE PRODUCTION
      if (costGroup == '01.Base Material') {
        this.updateTotalSummary(costGroupId);
        // this.updateLineSummary();
      }
    }
  }

  ///////-------- UPDATE OTHER LINE IF BASE MATERIAL ADDED OR EDITED
  updateLineSummary() {
    var base = '', baseQty = 0;
    var orderQty = this.expectedQty;

    /////////----========== GET BASE NOT EQUAL TO SQM ==================-----------
    const selectedRowData = this.costDtGrid.data.filter((record) => {
      return record.base != 'SQM';
    });

    if (selectedRowData.length > 0) {
      for (let a = 0; a < selectedRowData.length; a++) {
        var baseValue = 0,
          costPcs = 0,
          netCons = 0,
          grossCons = 0,
          autoId = 0;
        const element = selectedRowData[a];
        base = element['base'];

        if (base == 'Gross Weight') {
          baseQty = this.grossWeight; //this.costingHdForm.get("grossWeight").value;
        } else if (base == 'Net Weight') {
          baseQty = this.netWeight;
        }

        autoId = element['autoId'];
        var factor = element['factor'];
        var cost = element['cost'];
        var baseCons = element['consBase'];
        var westage = element['westage'];

        if (factor > 0) baseValue = factor * baseQty;
        else baseValue = baseQty;

        if (cost == 0) {
          netCons = 0;
          grossCons = 0;
          costPcs = this.roundTo(baseCons * baseValue, 4);
        } else {
          netCons = this.roundTo(baseValue * baseCons, 4);
          grossCons = this.roundTo(netCons + (netCons * westage) / 100, 4);
          costPcs = this.roundTo(grossCons * cost, 4);
        }

        var total = this.roundTo(orderQty * costPcs, 4);

        ///// UPDATE QTY IN GRID
        this.costDtGrid.updateCell(factor, autoId, 'factor');
        this.costDtGrid.updateCell(base, autoId, 'base');
        this.costDtGrid.updateCell(baseCons, autoId, 'consBase');
        this.costDtGrid.updateCell(westage, autoId, 'westage');
        this.costDtGrid.updateCell(cost, autoId, 'cost');
        this.costDtGrid.updateCell(baseValue, autoId, 'baseValue');
        this.costDtGrid.updateCell(netCons, autoId, 'netCons');
        this.costDtGrid.updateCell(grossCons, autoId, 'grossCons');
        this.costDtGrid.updateCell(costPcs, autoId, 'costPcs');
        this.costDtGrid.updateCell(total, autoId, 'total');
      }
      // this.calculateSubTotal();
    }
  }

  calculateCostHeader() {
    this.clearBoarderDetails();
    var unitConv3 = 1,
      unitConv1 = 1,
      unitConv2 = 1;
    // console.log(event.target.value);
    var tollerance = this.costingHdForm.get('tollerence').value;
    var article = this.costingHdForm.get('articleCode').value; //this.costingHdForm.get('articleName').value;
    console.log(article);
    //// check article is selected
    if (article != '') {
      // var length = this.costingHdForm.get("length").value;
      // var width = this.costingHdForm.get("width").value;
      // var height = this.costingHdForm.get("height").value;
      // var measurement = this.costingHdForm.get("measurement").value;

      if (this.measurement != 'M') {
        /// any mesurement to meters conversion
        var convValue1 = this.unitConvList.filter(
          (x) => x.fromUnit == this.measurement && x.toUnit == 'M'
        );
        unitConv1 = convValue1[0]['value'];
      }

      console.log(convValue1);

      if (convValue1 != undefined) {
        this.boardLength = this.roundTo(
          (this.width * 2 + length * 2 + tollerance) * unitConv1,
          2
        );

        // console.log(this.measurement);
        /// any mesurement to inch conversion
        if (this.measurement != 'INC') {
          var convValue3 = this.unitConvList.filter(
            (x) => x.fromUnit == this.measurement && x.toUnit == 'INC'
          );
          unitConv3 = convValue3[0]['value'];
        }

        this.actualReal = this.roundTo(
          (this.width + this.height) * unitConv3,
          2
        );

        this.ups = this.actualReal < 30.1 ? 2 : 1;
        this.reelSize = this.round_up_to_odd(this.actualReal * this.ups);

        // console.log(convValue2);

        var convValue2 = this.unitConvList.filter(
          (x) => x.fromUnit == 'INC' && x.toUnit == 'M'
        );
        this.boardWidth = this.roundTo(
          (this.reelSize / this.ups) * convValue2[0]['value'],
          2
        );
        this.sqm = this.roundTo(this.boardLength * this.boardWidth, 3);
        this.trimWaste = this.roundTo(
          this.reelSize - this.actualReal * this.ups,
          2
        );
        
        console.log(this.sqm);
        /// UPDATE SQM ON GRID
        this.updateSqmQty();
        //// UPDATE TOTAL WEIGHT IN HEADER AND OTHER GRID DATA (PASS BASE MATERIAL ID AS PARA)
        this.updateTotalSummary(4);
        /// CALCULATE SUB TOTAL
        this.calculateSubTotal();

        // console.log(boardLength);
        // console.log(boardWidth);
        // this.costingHdForm.get("boardLength").setValue(this.boardLength);
        // this.costingHdForm.get("boardWidth").setValue(this.boardWidth);
        // this.costingHdForm.get("sqm").setValue(this.sqm);
        // this.costingHdForm.get("actualReal").setValue(this.actualReal);
        // this.costingHdForm.get("reelSize").setValue(this.reelSize);
        // this.costingHdForm.get("trimWaste").setValue(this.trimWaste);
        // this.costingHdForm.get("ups").setValue(this.ups);
      } else {
        this.toastr.warning('Converstion details not exists');
      }
    } else {
      this.toastr.warning('article is required !!!');
    }
  }

  ///// ON COST HEADER ARTICLE CLEAR
  onClearCostArticle() {
    this.clearHeaderArticle();
    this.clearBoarderDetails();
    this.clearSubTotalControls();
    this.costingHdForm.get('combination').setValue('');
  }

  clearBoarderDetails() {
    this.boardLength = 0;
    this.boardWidth = 0;
    this.sqm = 0;
    this.actualReal = 0;
    this.reelSize = 0;
    this.trimWaste = 0;
    this.ups = 0;
    this.expectedQty = 0;
    this.netWeight = 0;
    this.grossWeight = 0;
    // this.costingHdForm.get("boardLength").setValue(0);
    // this.costingHdForm.get("boardWidth").setValue(0);
    // this.costingHdForm.get("sqm").setValue(0);
    // this.costingHdForm.get("actualReal").setValue(0);
    // this.costingHdForm.get("reelSize").setValue(0);
    // this.costingHdForm.get("trimWaste").setValue(0);
    // this.costingHdForm.get("ups").setValue(0);
  }

  //// round the any value
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    // console.log(factor);
    return Math.round(num * factor) / factor;
  }

  /// return nearest odd number
  round_up_to_odd(f) {
    f = Math.ceil(f);
    return f % 2 == 0 ? f + 1 : f;
  }

  //// CLACULATE SUB TOTAL FROM GRID
  calculateSubTotal() {
    this.subTotalForm.get('totCostBox').setValue(0);
    this.subTotalForm.get('totCostMoq').setValue(0);
    this.subTotalForm.get('profitMarkup').setValue(0);
    this.subTotalForm.get('sellPrice').setValue(0);
    this.subTotalForm.get('sellPriceCom').setValue(0);

    const allRows = this.costDtGrid.data;
    var totCostPcs = 0,
      moqCost = 0,
      totCostMOQ = 0,
      markup = 0,
      profitMarkup = 0,
      sellPrice = 0,
      commission = 0,
      sellPriceCom = 0;

    for (let a = 0; a < allRows.length; a++) {
      const element = allRows[a];
      totCostPcs = totCostPcs + this.roundTo(element['costPcs'], 4);
    }

    totCostPcs = this.roundTo(totCostPcs, 4);

    moqCost = this.subTotalForm.get('moqCost').value;
    markup = this.subTotalForm.get('markup').value;
    commission = this.subTotalForm.get('commission').value;
    // console.log(totCostPcs);
    totCostMOQ = moqCost + totCostPcs;
    profitMarkup = (totCostPcs * markup) / 100;
    sellPrice = profitMarkup + totCostMOQ;
    sellPriceCom = sellPrice - (sellPrice * commission) / 100;

    // console.log(totCostPcs);
    // console.log(totCostMOQ);
    this.subTotalForm.get('totCostBox').setValue(totCostPcs);
    this.subTotalForm.get('totCostMoq').setValue(this.roundTo(totCostMOQ, 4));
    this.subTotalForm
      .get('profitMarkup')
      .setValue(this.roundTo(profitMarkup, 4));
    this.subTotalForm.get('sellPrice').setValue(this.roundTo(sellPrice, 4));
    this.subTotalForm
      .get('sellPriceCom')
      .setValue(this.roundTo(sellPriceCom, 4));
  }

  addCostingDetails() {
    // this.isBaseMatSel = 0;
    var autoId = this.baseMatForm.get('autoId').value;
    var groupOrder = 1,
      baseCons = 0,
      baseValue = 0,
      costPcs = 0,
      netCons = 0,
      grossCons = 0,
      uomId = 0;

    var factor =
      this.baseMatForm.get('factor').value == null
        ? 0
        : this.baseMatForm.get('factor').value;
    var baseQty = 0;
    var base =
      this.baseMatForm.get('base').value == ''
        ? 0
        : this.baseMatForm.get('base').value[0];
    var westage =
      this.baseMatForm.get('westage').value == null
        ? 0
        : this.baseMatForm.get('westage').value;
    var cost =
      this.baseMatForm.get('cost').value == null
        ? 0
        : this.baseMatForm.get('cost').value;
    var orderQty = this.expectedQty;
    var gsm =
      this.baseMatForm.get('gsm').value == null
        ? 0
        : this.baseMatForm.get('gsm').value;
    var costGroupId =
      this.baseMatForm.get('costGroup').value == ''
        ? 0
        : this.baseMatForm.get('costGroup').value[0];
    var costGroup = this.costGroup.value;
    var unitId =
      this.baseMatForm.get('uom').value == ''
        ? 0
        : this.baseMatForm.get('uom').value[0];
    var article = this.item.value == null ? 0 : this.item.value;
    var articleId = this.baseMatForm.get('article').value[0];
    var gsm =
      this.baseMatForm.get('gsm').value == null
        ? 0
        : this.baseMatForm.get('gsm').value;
    var colorId =
      this.baseMatForm.get('color').value == ''
        ? 0
        : this.baseMatForm.get('color').value[0];
    var color = this.mColor.value;
    var sizeId =
      this.baseMatForm.get('size').value == ''
        ? 0
        : this.baseMatForm.get('size').value[0];
    var size = this.mSize.value;
    var fluteTypeId =
      this.baseMatForm.get('fluteType').value == ''
        ? 0
        : this.baseMatForm.get('fluteType').value[0];
    var unitId =
      this.baseMatForm.get('uom').value == ''
        ? 0
        : this.baseMatForm.get('uom').value[0];
    // var cost =
    //   this.baseMatForm.get('cost').value == 0
    //     ? 0
    //     : this.baseMatForm.get('cost').value;
    var fluteType = this.fluteType.value;
    var uom = this.uom.value;

    // console.log(this.baseMatForm.get('fluteType').value[0]);

    if (this.articleConList.length > 0) {
      // console.log(this.articleConList);
      // console.log(unitId);
      var result = this.articleConList.filter((x) => x.unitId == unitId);
      if (result.length > 0) {
        baseCons = result[0]['value'];
        uomId = result[0]['autoId'];
      }
    }

    if (base == 'SQM') {
      baseQty = this.sqm; //this.costingHdForm.get("sqm").value
    } else if (base == 'Gross Weight') {
      baseQty = this.grossWeight; //this.costingHdForm.get("grossWeight").value;
    } else if (base == 'Net Weight') {
      baseQty = this.netWeight;
    }

    if (factor > 0) baseValue = factor * baseQty;
    else baseValue = baseQty;

    // console.log(baseCons);
    ///// other cost caluclation
    if (cost == 0) {
      netCons = 0;
      grossCons = 0;
      costPcs = this.roundTo(baseCons * baseValue, 4);
    } else {
      netCons = this.roundTo(baseValue * baseCons, 4);
      grossCons = this.roundTo(netCons + (netCons * westage) / 100, 4);
      costPcs = this.roundTo(grossCons * cost, 4);
    }

    var total = this.roundTo(orderQty * costPcs, 4);

    ///// GET ALREADY ADDED ROWS AND RELATED TO SAME COSTING GROUP
    const selectedRowData = this.costDtGrid.data.filter((record) => {
      return record.costGroupId == costGroupId;
    });

    //// CHECK IF IT IS NEW RECORD
    if (autoId == 0) {
      groupOrder = selectedRowData.length + 1;
      //// generate new id
      autoId = this.findMaxDelId(this.costDtGrid.data) + 1;

      var obj = {
        autoId: autoId,
        costGroupId: costGroupId,
        costGroup: this.costGroup.value,
        groupOrder: groupOrder,
        article: article,
        articleId: articleId,
        gsm: gsm,
        colorId: colorId,
        color: color,
        sizeId: sizeId,
        size: size,
        fluteTypeId: fluteTypeId,
        fluteType: fluteType,
        factor: factor,
        base: base,
        consBase: baseCons,
        unitId: unitId,
        uom: uom,
        uomId: uomId,
        westage: westage,
        cost: cost,
        baseValue: baseValue,
        netCons: netCons,
        grossCons: grossCons,
        costPcs: costPcs,
        total: total,
      };

      this.costDtGrid.addRow(obj);
    } else {
      /// UPDATE EXISTING ROW DATA
      this.costDtGrid.updateCell(article, autoId, 'article');
      this.costDtGrid.updateCell(articleId, autoId, 'articleId');
      this.costDtGrid.updateCell(gsm, autoId, 'gsm');
      this.costDtGrid.updateCell(colorId, autoId, 'colorId');
      this.costDtGrid.updateCell(color, autoId, 'color');
      this.costDtGrid.updateCell(sizeId, autoId, 'sizeId');
      this.costDtGrid.updateCell(size, autoId, 'size');
      this.costDtGrid.updateCell(fluteTypeId, autoId, 'fluteTypeId');
      this.costDtGrid.updateCell(fluteType, autoId, 'fluteType');
      this.costDtGrid.updateCell(factor, autoId, 'factor');
      this.costDtGrid.updateCell(base, autoId, 'base');
      this.costDtGrid.updateCell(baseCons, autoId, 'consBase');
      this.costDtGrid.updateCell(unitId, autoId, 'unitId');
      this.costDtGrid.updateCell(uom, autoId, 'uom');
      this.costDtGrid.updateCell(westage, autoId, 'westage');
      this.costDtGrid.updateCell(cost, autoId, 'cost');
      this.costDtGrid.updateCell(baseValue, autoId, 'baseValue');
      this.costDtGrid.updateCell(netCons, autoId, 'netCons');
      this.costDtGrid.updateCell(grossCons, autoId, 'grossCons');
      this.costDtGrid.updateCell(costPcs, autoId, 'costPcs');
      this.costDtGrid.updateCell(total, autoId, 'total');
    }

    // console.log(obj);
    //// CALCULATE only IF BASE PRODUCTION
    if (costGroup == '01.Base Material') {
      this.updateTotalSummary(costGroupId);
    }
    this.calculateSubTotal();
    this.clearCostDetControls();
  }

  //// IF HEADER ARTICLE CHANGE SQM WILL BE RECALCULATE 
  //// MUST CHANGE IN THE GRID ALSO 
  updateSqmQty() {
    var baseQty = 0;
    var orderQty = this.expectedQty;

    /////////----========== GET BASE ROWS WITH SQM ==================-----------
    const selectedRowData = this.costDtGrid.data.filter((record) => {
      return record.base == 'SQM';
    });

    if (selectedRowData.length > 0) {
      for (let a = 0; a < selectedRowData.length; a++) {
        var baseValue = 0, costPcs = 0, netCons = 0, grossCons = 0, autoId = 0;
        const element = selectedRowData[a];
        baseQty = this.sqm;          

        autoId = element['autoId'];
        var factor = element['factor'];
        var cost = element['cost'];
        var baseCons = element['consBase'];
        var westage = element['westage'];

        if (factor > 0) baseValue = factor * baseQty;
        else baseValue = baseQty;

        if (cost == 0) {
          netCons = 0;
          grossCons = 0;
          costPcs = this.roundTo(baseCons * baseValue, 4);
        } else {
          netCons = this.roundTo(baseValue * baseCons, 4);
          grossCons = this.roundTo(netCons + (netCons * westage) / 100, 4);
          costPcs = this.roundTo(grossCons * cost, 4);
        }

        var total = this.roundTo(orderQty * costPcs, 4);

        ///// UPDATE QTY IN GRID
        this.costDtGrid.updateCell(factor, autoId, 'factor');
        this.costDtGrid.updateCell('SQM', autoId, 'base');
        this.costDtGrid.updateCell(baseCons, autoId, 'consBase');
        this.costDtGrid.updateCell(westage, autoId, 'westage');
        this.costDtGrid.updateCell(cost, autoId, 'cost');
        this.costDtGrid.updateCell(baseValue, autoId, 'baseValue');
        this.costDtGrid.updateCell(netCons, autoId, 'netCons');
        this.costDtGrid.updateCell(grossCons, autoId, 'grossCons');
        this.costDtGrid.updateCell(costPcs, autoId, 'costPcs');
        this.costDtGrid.updateCell(total, autoId, 'total');
      }
      // this.calculateSubTotal();
    }

  }

  resetCostDetails() {
    var baseQty = 0 , base ='' ;
    var orderQty = this.expectedQty;

    /////////----========== GET BASE ROWS WITH SQM ==================-----------
    const selectedRowData = this.costDtGrid.data;

    console.log(selectedRowData);

    if (selectedRowData.length > 0) {
      for (let a = 0; a < selectedRowData.length; a++) {
        var baseValue = 0, costPcs = 0, netCons = 0, grossCons = 0, autoId = 0;
        const element = selectedRowData[a];
        base = element['base'];

        if (base == 'Gross Weight') {
          baseQty = this.grossWeight; //this.costingHdForm.get("grossWeight").value;
        } else if (base == 'Net Weight') {
          baseQty = this.netWeight;
        } else if (base == 'SQM') {
          baseQty = this.sqm;
        }

        autoId = element['autoId'];
        var factor = element['factor'];
        var cost = element['cost'];
        var baseCons = element['consBase'];
        var westage = element['westage'];

        if (factor > 0) baseValue = factor * baseQty;
        else baseValue = baseQty;

        if (cost == 0) {
          netCons = 0;
          grossCons = 0;
          costPcs = this.roundTo(baseCons * baseValue, 4);
        } else {
          netCons = this.roundTo(baseValue * baseCons, 4);
          grossCons = this.roundTo(netCons + (netCons * westage) / 100, 4);
          costPcs = this.roundTo(grossCons * cost, 4);
        }

        var total = this.roundTo(orderQty * costPcs, 4);

        ///// UPDATE QTY IN GRID
        this.costDtGrid.updateCell(baseCons, autoId, 'consBase');
        this.costDtGrid.updateCell(westage, autoId, 'westage');
        this.costDtGrid.updateCell(cost, autoId, 'cost');
        this.costDtGrid.updateCell(baseValue, autoId, 'baseValue');
        this.costDtGrid.updateCell(netCons, autoId, 'netCons');
        this.costDtGrid.updateCell(grossCons, autoId, 'grossCons');
        this.costDtGrid.updateCell(costPcs, autoId, 'costPcs');
        this.costDtGrid.updateCell(total, autoId, 'total');
      }
      // this.calculateSubTotal();
    }
  }

  /// GET MAXIMUMUM auto ID
  findMaxDelId(arr) {
    var maxValue: number = 0;
    // console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].autoId > maxValue) {
        maxValue = arr[i].autoId;
      }
    }
    return maxValue;
  }

  clearCostDetControls() {
    this.mcolorList = [];
    this.msizeList = [];
    this.costPriceList = [];
    // this.baseMatForm.reset();
    this.costGroup.disabled = false;
    this.baseMatForm.get('autoId').setValue(0);
    this.baseMatForm.get('gsm').setValue(0);
    this.baseMatForm.get('factor').setValue(0);
    // this.baseMatForm.get('consBase').setValue(0);
    this.baseMatForm.get('westage').setValue(0);

    this.baseMatForm.get('article').setValue('');
    this.baseMatForm.get('color').setValue('');
    this.baseMatForm.get('size').setValue('');
    // this.baseMatForm.get('articleId').setValue(0);
    this.baseMatForm.get('fluteType').setValue('');
    this.baseMatForm.get('base').setValue('');
    this.baseMatForm.get('uom').setValue('');
    this.baseMatForm.get('cost').setValue(0);
  }

  //// LOADS ITEM TO FORM CONTROL
  onItemEdit(event, cellId) {
    const ids = cellId.rowID;
    this.isArtiHdSel = false;

    /// GET SELECTED ROW DATA
    const selectedRowData = this.costDtGrid.data.filter((record) => {
      return record.autoId == ids;
    });
    // console.log(selectedRowData);

    var articleId = selectedRowData[0]['articleId'];

    this.costGroup.disabled = true;
    this.costGroup.setSelectedItem(selectedRowData[0]['costGroupId'], true);
    this.base.setSelectedItem(selectedRowData[0]['base'], true);
    this.uom.setSelectedItem(selectedRowData[0]['unitId'], true);

    if (selectedRowData[0]['fluteTypeId'] > 0)
      this.fluteType.setSelectedItem(selectedRowData[0]['fluteTypeId'], true);

    this.loadColor(articleId);
    this.loadSize(articleId);
    // this.loadCostPrice(articleId);
    this.loadArticleUOMConversion(articleId);

    this.baseMatForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.item.setSelectedItem(articleId, true);
    // this.baseMatForm.get('article').setValue(selectedRowData[0]['article']);
    this.baseMatForm.get('gsm').setValue(selectedRowData[0]['gsm']);
    this.baseMatForm.get('cost').setValue(selectedRowData[0]['cost']);
    this.baseMatForm.get('factor').setValue(selectedRowData[0]['factor']);
    this.baseMatForm.get('westage').setValue(selectedRowData[0]['westage']);
    this.mSelColor = selectedRowData[0]['colorId'];
    this.mSelSize = selectedRowData[0]['sizeId'];
    // this.costPrice = selectedRowData[0]['cost'];
    this.setComboValues();
  }

  //// SET COMBO VALUES
  setComboValues() {
    setTimeout(() => {
      //console.log("pending");
      this.mColor.setSelectedItem(this.mSelColor, true);
      this.mSize.setSelectedItem(this.mSelSize, true);
      // this.cost.setSelectedItem(this.costPrice, true);
    }, 1000);
  }

  //// FILTER ALL BASE MATERIAL DETAILS AND
  //// UPDATE COMBINATION , TOTAL NET WEIGHT AND TOTAL GROSS WEIGHT
  updateTotalSummary(costGroupId) {
    this.costingHdForm.get('combination').setValue('');
    var combinationVal = '',
      totalNetWeight = 0,
      totgrossWeight = 0;
    this.costDtGrid.sort({
      fieldName: 'groupOrder',
      dir: SortingDirection.Asc,
      ignoreCase: false,
    });

    /// GET ONLY BASE MATERIAL ID
    const selectedRowData = this.costDtGrid.data.filter((record) => {
      return record.costGroupId == costGroupId;
    });

    if (selectedRowData.length > 0) {
      for (let a = 0; a < selectedRowData.length; a++) {
        //// calculate total weight and gross
        totalNetWeight = totalNetWeight + selectedRowData[a]['netCons'];
        totgrossWeight = totgrossWeight + selectedRowData[a]['grossCons'];

        /// create combination
        if (a == 0) combinationVal = selectedRowData[a]['gsm'];
        else combinationVal = combinationVal + '/' + selectedRowData[a]['gsm'];
      }
      this.costingHdForm.get('combination').setValue(combinationVal);
      this.grossWeight = this.roundTo(totgrossWeight, 4);
      this.netWeight = this.roundTo(totalNetWeight, 4);
    }

    this.updateLineSummary();
  }

  /// SAVE COSTING DEATILS
  saveCosting() {
    if (this.saveButton == true) {
      if (this.validateCosting()) {
        var costList = [],
          itemList = [],
          specialList = [],
          customerId = 0;
        var versionNo = this.costingHdForm.get('versionControl').value + 1;

        customerId = this.costingHdForm.get('customerId').value[0];
        //console.log(this.chkIsCharge.checked);
        ////--------=========== SALES ORDER HEADER =======================---------
        var headerData = {
          autoId: this.costingHdForm.get('autoId').value,
          refNo: this.costingHdForm.get('refNo').value.trim(),
          customerId: customerId,
          articleId: this.costingHdForm.get('articleName').value[0],
          versionControl: versionNo,
          colorId: this.costingHdForm.get('colorId').value[0],
          sizeId: this.costingHdForm.get('sizeId').value[0],
          combination: this.costingHdForm.get('combination').value.toString().trim(),
          noOfUps: this.ups,
          brandCodeId: this.costingHdForm.get('brandCodeId').value,
          pDHeaderId: this.specInsForm.get('prodDefinition').value[0],
          boardLength: this.boardLength,
          createUserId: this.user.userId,
          boardWidth: this.boardWidth,
          sqm: this.sqm,
          reelSize: this.reelSize,
          actualReal: this.actualReal,
          trimWaste: this.trimWaste,
          totNetWeight: this.netWeight,
          totGrossWeight: this.grossWeight,
          tollerence: this.costingHdForm.get('tollerence').value,
          totalBoxCost: this.subTotalForm.get('totCostBox').value,
          moqCost: this.subTotalForm.get('moqCost').value,
          markup: this.subTotalForm.get('markup').value,
          sellingPrice: this.subTotalForm.get('sellPrice').value,
          commission: this.subTotalForm.get('commission').value,
          totMOQCost: this.subTotalForm.get('totCostMoq').value,
          profitMarkup: this.subTotalForm.get('profitMarkup').value,
          commSelPrice: this.subTotalForm.get('sellPriceCom').value,
        };

        var objHead = {
          costingHeader: headerData,
        };

        costList.push(objHead);

        ////--------=========== COST DETAILS LIST =======================---------
        var itemRows = this.costDtGrid.data;
        // console.log(itemRows);
        itemRows.forEach((items) => {
          var itemdata = {
            costGroupId: items.costGroupId,
            articleId: items.articleId,
            sizeId: items.sizeId,
            colorId: items.colorId,
            unitId: items.unitId,
            gsm: items.gsm,
            fluteId: items.fluteTypeId,
            cost: items.cost,
            base: items.base,
            baseValue: items.baseValue,
            wastage: items.westage,
            artiUOMConvId: items.uomId,
            netCon: items.netCons,
            grossCon: items.grossCons,
            costPcs: items.costPcs,
          };
          itemList.push(itemdata);
        });
        costList.push({ costingDetails: itemList });

        ////--------=========== COSTING SPECIAL INSTRUCTION =======================---------
        var instructRows = this.specInstGrid.data;

        instructRows.forEach((result) => {
          var specialdata = {
            speInstId: result.autoId,
            value: result.value,
          };
          specialList.push(specialdata);
        });

        costList.push({ costingSpecial: specialList });
        // console.log(costList);

        this.salesOrderServices.saveCosting(costList).subscribe((result) => {
          // console.log(result);
          if (result['result'] == 1) {
            this.toastr.success('Costing save Successfully !!!');
            this.costingHdForm.get('autoId').setValue(result['refNumId']);
            this.costingHdForm.get('refNo').setValue(result['refNum']);
            this.costingHdForm.get('versionControl').setValue(versionNo);
            this.isDisplayMode = true;
            this.loadCostHeaderList(customerId);
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result['result'].toString()
            );
          }
        });
      }
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  ///// VALIDATION BEFORE SAVE SALES ORDER
  validateCosting() {
    if (this.specInsForm.get('prodDefinition').value > 0) {
      if (this.costDtGrid.dataLength > 0) {
        return true;
      } else {
        this.toastr.info('Fill Cost Details !!!');
        return false;
      }
    } else {
      this.toastr.info('Product Definition is reqired !!!');
      return false;
    }
  }

  //////// CLEAR ALL COSTING DETAILS
  refreshCosting() {
    this.isDisplayMode = false;
    this.isActive = true;
    var date: Date = new Date(Date.now());

    this.costingHdForm.get('autoId').setValue(0);
    this.costingHdForm.get('refNo').reset();
    this.costingHdForm.get('customerId').reset();
    this.costingHdForm.get('brandCodeId').reset();
    this.costingHdForm.get('brandCode').reset();
    this.costingHdForm.get('colorId').reset();
    this.costingHdForm.get('sizeId').reset();
    this.costingHdForm.get('combination').reset();
    this.costingHdForm.get('versionControl').setValue(0);
    this.costingHdForm.get('trnsDate').setValue(date);
    this.costingHdForm.get('isActive').setValue('Active');

    this.articleSelForm.get('category').reset();
    this.articleSelForm.get('prodType').reset();
    this.articleSelForm.get('prodGroup').reset();

    this.brandSelForm.get('brand').reset();

    this.colorList = [];
    this.sizeList = [];
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];

    this.clearHeaderArticle();
    this.clearBoarderDetails();
    this.getCostRefNo();
    this.clearCostDetControls();
    this.clearSubTotalControls();

    this.clearSpecInstruction();
    // this.baseMatForm.get('consBase').setValue(0);
    this.prodDefiDetails = [];
    this.costDetailsList = [];
    this.instructList = [];
    this.specInsForm.get('prodDefinition').reset();
  }

  //// CLEAR SUB TOTAL CONTROLS
  clearSubTotalControls() {
    this.subTotalForm.get('totCostBox').setValue(0);
    this.subTotalForm.get('moqCost').setValue(0);
    this.subTotalForm.get('totCostMoq').setValue(0);
    this.subTotalForm.get('markup').setValue(0);
    this.subTotalForm.get('profitMarkup').setValue(0);
    this.subTotalForm.get('sellPrice').setValue(0);
    this.subTotalForm.get('commission').setValue(0);
    this.subTotalForm.get('sellPriceCom').setValue(0);
  }

  //// CLICK EVENT OF COST LIST GRID ROW
  onViewCostingDetails(event, cellId) {
    this.refreshCosting();
    this.isDisplayMode = true;
    var costHeaderId = cellId.rowID;
    // const selectedRowData = this.costListGrid.data.filter((record) => {
    //   return record.autoId == ids;
    // });
    this.getCostSheetDetails(costHeaderId , "V");
  }

  ///// COPY EXISTING COST SHEET TO NEW ONE
  onCopyCostingDetails(event, cellId) {
    this.refreshCosting();
    var costHeaderId = cellId.rowID;
    this.getCostSheetDetails(costHeaderId , "C");
    console.log("C");
  }

  ///// LOADS EXISTING COST SHEET 
  getCostSheetDetails(costHeaderId, option) {
    this.salesOrderServices.getCostSheetDetails(costHeaderId).subscribe(
      (result) => {
        // console.log(result);
        // console.log(result.costHeader);
        var costMatList = [],
          specialList = [];
        this.isArtiHdSel = true;

        if (result.costHeader != null) {
          var costHeaderRow = result.costHeader;
          ///---------============= LOADS COST HEADER ================-------------
          var articleId = costHeaderRow[0]['articleId'];

          //console.log(costHeaderRow[0]['transDate']);
          if (option == "V") {
            var trnsDate: Date = new Date(
              this.datePipe.transform(costHeaderRow[0]['transDate'], 'yyyy-MM-dd')
            );
            this.costingHdForm.get('trnsDate').setValue(trnsDate); 
            this.costingHdForm.get('versionControl').setValue(costHeaderRow[0]['versionControl']); 
            this.costingHdForm.get('refNo').setValue(costHeaderRow[0]['refNo']);
            this.costingHdForm.get('autoId').setValue(costHeaderId);

            this.isActive = costHeaderRow[0]['isActive'];

            if (this.isActive == true)
              this.costingHdForm.get('isActive').setValue('Active');
            else this.costingHdForm.get('isActive').setValue('Deactive'); 
          }

          this.costingHdForm
            .get('brandCodeId')
            .setValue(costHeaderRow[0]['brandCodeId']);
          this.costingHdForm
            .get('brandCode')
            .setValue(costHeaderRow[0]['brandCode']);
          this.costingHdForm
            .get('combination')
            .setValue(costHeaderRow[0]['combination']);
          this.customer.setSelectedItem(costHeaderRow[0]['customerId'], true);
          this.prodDefintion.setSelectedItem(costHeaderRow[0]['pdHeaderId'], true );

          this.article.setSelectedItem(articleId, true);
          // this.costingHdForm.get('articleId').setValue(articleId);
          // this.costingHdForm
          //   .get('articleName')
          //   .setValue(costHeaderRow[0]['articleName']);
          this.costingHdForm
            .get('articleCode')
            .setValue(costHeaderRow[0]['stockCode']);
          this.costingHdForm
            .get('tollerence')
            .setValue(costHeaderRow[0]['tollerence']);

          this.loadColor(articleId);
          this.loadSize(articleId);
          this.loadArticleUOMConversion(articleId);

          this.measurement = costHeaderRow[0]['measurement'];
          this.length = costHeaderRow[0]['length'];
          this.width = costHeaderRow[0]['width'];
          this.height = costHeaderRow[0]['height'];
          this.boardLength = costHeaderRow[0]['boardLength'];
          this.boardWidth = costHeaderRow[0]['boardWidth'];
          this.ups = costHeaderRow[0]['noOfUps'];
          this.actualReal = costHeaderRow[0]['actualReal'];
          this.reelSize = costHeaderRow[0]['reelSize'];
          this.trimWaste = costHeaderRow[0]['trimWaste'];
          this.sqm = costHeaderRow[0]['sqm'];
          this.netWeight = costHeaderRow[0]['totNetWeight'];
          this.grossWeight = costHeaderRow[0]['totGrossWeight'];
          this.headerColor = costHeaderRow[0]['colorId'];
          this.headerSize = costHeaderRow[0]['sizeId'];

          // console.log(costHeaderRow);

          ////------------============= LOADS SUB TOTAL ==============----------------
          this.subTotalForm
            .get('totCostBox')
            .setValue(costHeaderRow[0]['totalBoxCost']);
          this.subTotalForm
            .get('moqCost')
            .setValue(costHeaderRow[0]['moqCost']);
          this.subTotalForm
            .get('totCostMoq')
            .setValue(costHeaderRow[0]['totMOQCost']);
          this.subTotalForm.get('markup').setValue(costHeaderRow[0]['markup']);
          this.subTotalForm
            .get('profitMarkup')
            .setValue(costHeaderRow[0]['profitMarkup']);
          this.subTotalForm
            .get('sellPrice')
            .setValue(costHeaderRow[0]['sellingPrice']);
          this.subTotalForm
            .get('commission')
            .setValue(costHeaderRow[0]['commission']);
          this.subTotalForm
            .get('sellPriceCom')
            .setValue(costHeaderRow[0]['commSelPrice']);
        }

        if (result.costDetails != null) {
          var costDetailList = result.costDetails;

          ////----------============= LOADS COST DETAIL ====================------------------
          for (let index = 0; index < costDetailList.length; index++) {
            var obj = {
              autoId: costDetailList[index]['costDetailId'],
              costGroupId: costDetailList[index]['costGroupId'],
              costGroup: costDetailList[index]['costGroup'],
              groupOrder: costDetailList[index]['groupOrder'],
              article: costDetailList[index]['articleName'],
              articleId: costDetailList[index]['articleId'],
              gsm: costDetailList[index]['gsm'],
              colorId: costDetailList[index]['colorId'],
              color: costDetailList[index]['color'],
              sizeId: costDetailList[index]['sizeId'],
              size: costDetailList[index]['size'],
              fluteTypeId: costDetailList[index]['fluteId'],
              fluteType: costDetailList[index]['fluteType'],
              factor: costDetailList[index]['factor'],
              base: costDetailList[index]['base'],
              consBase: costDetailList[index]['consBase'],
              unitId: costDetailList[index]['unitId'],
              uom: costDetailList[index]['uom'],
              uomId: costDetailList[index]['uomId'],
              westage: costDetailList[index]['wastage'],
              cost: costDetailList[index]['cost'],
              baseValue: costDetailList[index]['baseValue'],
              netCons: costDetailList[index]['netCon'],
              grossCons: costDetailList[index]['grossCon'],
              costPcs: costDetailList[index]['costPcs'],
              total: 0,
            };
            costMatList.push(obj);
          }
        }

        if (result.costSpecials != null) {
          var costSpecInsList = result.costSpecials;
          ////----------============ LOADS SPECIAL INSTRUCTION ==================----------------
          for (let index = 0; index < costSpecInsList.length; index++) {
            var specialdata = {
              autoId: costSpecInsList[index]['speInstId'],
              value: costSpecInsList[index]['value'],
              description: costSpecInsList[index]['instruction'],
            };
            specialList.push(specialdata);
          }
        }
        this.costDetailsList = costMatList;
        this.instructList = specialList;
      },
      (err) => console.error(err),
      () => {
        this.setCostComboValues();
      }
    );
  }

  setCostComboValues() {
    // console.log(this.colorList);
    // console.log(this.headerColor);
    setTimeout(() => {
      this.cmbcolor.setSelectedItem(this.headerColor, true);
      this.cmbsize.setSelectedItem(this.headerSize, true);
    }, 1000);
  }

  printCostSheet() {
    if(this.printButton == true) {
      // this.router.navigate(['/boldreport']);
      var obj = {
        costingHdId: this.costingHdForm.get('autoId').value,
        reportName: "CostSheetFormat"
      }
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }
  
}
