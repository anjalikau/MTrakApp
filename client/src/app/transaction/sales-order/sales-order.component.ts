import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IComboSelectionChangeEventArgs,
  IgxCheckboxComponent,
  IgxColumnComponent,
  IgxComboComponent,
  IgxDialogComponent,
  IgxGridComponent,
} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Size } from 'src/app/_models/size';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';
import { ProductType } from 'src/app/_models/productType';
import { Category } from 'src/app/_models/category';
import { ProductGroup } from 'src/app/_models/productGroup';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css'],
})
export class SalesOrderComponent implements OnInit {
  soHeaderForm: FormGroup;
  soItemForm: FormGroup;
  soDeliveyForm: FormGroup;
  articleForm: FormGroup;
  soDelivList: any[];
  delRef = [];
  transferItem: any;
  articleList: Article[];
  colorList: Color[];
  sizeList: Size[];
  soItemList: any[];
  user: User;
  customerList: CustomerHd[];
  customerDtList: CustomerLoc[];
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  categoryList: Category[];
  customerUserList: any[];
  customerCurrList: any[];
  salesCatList: any[];
  payTermsList: any[];
  countryList: any[];
  divisionList: any[];
  salesAgentList: any[];
  validationErrors: string[] = [];
  public date: Date = new Date(Date.now());
  // showArtiForm: boolean = false;
  // showArticle: boolean = true;
  isView: boolean = false;  
  showColor: boolean = true;
  showSize: boolean = true;
  btnStatus: string = '';
  rowId: number = 0;
  customerUserId: number;
  cusCurrencyId: number;
  customerDivId: number;
  articleId: number = 0;
  isJobCreated: boolean = false;
  //isIntentCreated: boolean = false;
  cuslocationId: number = 0;
  cusUserId: number = 0;
  cuscusCurrencyId: number = 0;
  cusDivisionId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('itemGrid', { static: true })
  public itemGrid: IgxGridComponent;
  @ViewChild('deliveryGrid', { static: true })
  public deliveryGrid: IgxGridComponent;
  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;

  @ViewChild('cmbarticle', { read: IgxComboComponent })
  public cmbarticle: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;
  @ViewChild('delArticle', { read: IgxComboComponent })
  public delArticle: IgxComboComponent;
  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('users', { read: IgxComboComponent })
  public users: IgxComboComponent;
  @ViewChild('location', { read: IgxComboComponent })
  public location: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('salesCat', { read: IgxComboComponent })
  public salesCat: IgxComboComponent;
  @ViewChild('payTerms', { read: IgxComboComponent })
  public payTerms: IgxComboComponent;
  @ViewChild('countries', { read: IgxComboComponent })
  public countries: IgxComboComponent;
  @ViewChild('salesAgents', { read: IgxComboComponent })
  public salesAgents: IgxComboComponent;
  @ViewChild('division', { read: IgxComboComponent })
  public division: IgxComboComponent;
  @ViewChild('delivLocation', { read: IgxComboComponent })
  public delivLocation: IgxComboComponent;
  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('prodType', { read: IgxComboComponent })
  public prodType: IgxComboComponent;
  @ViewChild('prodGroup', { read: IgxComboComponent })
  public prodGroup: IgxComboComponent;

  @ViewChild('chkIsCharge', { read: IgxCheckboxComponent })
  public chkIsCharge: IgxCheckboxComponent;

  @ViewChild('articleDialog', { read: IgxDialogComponent })
  public articleDialog: IgxDialogComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  // @ViewChild('form', { read: IgxDialogComponent })
  // public form: IgxDialogComponent;

  //// FORMAT PRICE
  public options = {
    digitsInfo: '1.2-2',
    currencyCode: '',
  };
  public formatPrice = this.options;

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
    this.getSalesOrderRefNo();
    this.loadCustomer();
    this.loadSalesCategory();
    this.loadCountries();
    this.loadPaymentTerms();
    this.loadSalesAgent();
    this.loadCategory();
    //this.LoadArticle();
    //this.LoadDelRef();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.soHeaderForm = this.fb.group({
      headerId: [0],
      createUserId: this.user.userId,
      orderRef: ['', [Validators.maxLength(15)]],
      customerRef: ['', [Validators.required, Validators.maxLength(20)]],
      customerId: ['', Validators.required],
      customerLocId: [''],
      customerUserId: [''],
      salesCategoryId: [''],
      salesAgentId: [''],
      cusCurrencyId: [''],
      countryId: [''],
      paymentTermId: [''],
      customerDivId: [''],
      isChargeable: [''],
      billToId: [''],
      trnsDate: [{ value: date, disabled: true }],
      delDate: ['', Validators.required],
    });

    this.articleForm = this.fb.group({
      category: ['', Validators.required],
      prodType: ['', Validators.required],
      prodGroup: ['', Validators.required],
    });

    this.soItemForm = this.fb.group({
      itemId: [0],
      articleId: [0],
      articleName: [{ value: '', disabled: true }],
      articleCode: [{ value: '', disabled: true }],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      qty: ['', Validators.required],
      price: [{ value: 0, decimalScale: 2 }, Validators.required],
    });

    this.soDeliveyForm = this.fb.group({
      itemId: [0],
      deliveryId: [0],
      articleId: [0],
      articleName: [{ value: '', disabled: true }, Validators.required],
      color: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      qty: [0, Validators.required],
      deliCustLocId: [0],
      deliveryRef: ['', Validators.required],
      deliveryDate: ['', Validators.required],
    });
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

  // deliveryFormEnable() {
  //   this.soDeliveyForm.get("deliCustLocId").enable();
  //   this.soDeliveyForm.get("qty").enable();
  //   this.soDeliveyForm.get("deliveryRef").enable();
  //   this.soDeliveyForm.get("deliveryDate").enable();
  // }

  // deliveryFormDisable() {
  //   this.soDeliveyForm.get("deliCustLocId").disable();
  //   this.soDeliveyForm.get("qty").disable();
  //   this.soDeliveyForm.get("deliveryRef").disable();
  //   this.soDeliveyForm.get("deliveryDate").disable();
  // }

  //// ORDER REFERANCE NO KEY UP EVENT
  onKey(event: any) {
    //this.soDeliveyForm.disable();
    //console.log(event.keyCode);
    if (event.keyCode != 13) {
      // this.deliveryFormDisable();
      this.customer.disabled = false;
      this.soHeaderForm.get('customerRef').enable();
      this.articleForm.reset();
      this.isJobCreated = false;
      var date: Date = new Date(Date.now());

      this.soHeaderForm.get('headerId').setValue(0);
      this.soHeaderForm.get('customerRef').setValue('');
      this.soHeaderForm.get('customerId').setValue('');
      this.soHeaderForm.get('customerLocId').setValue('');
      this.soHeaderForm.get('trnsDate').setValue(date);
      this.soHeaderForm.get('delDate').setValue('');
      this.soHeaderForm.get('customerUserId').setValue('');
      this.soHeaderForm.get('salesCategoryId').setValue('');
      this.soHeaderForm.get('salesAgentId').setValue('');
      this.soHeaderForm.get('cusCurrencyId').setValue('');
      this.soHeaderForm.get('countryId').setValue('');
      this.soHeaderForm.get('paymentTermId').setValue('');
      this.soHeaderForm.get('customerDivId').setValue('');
      this.soHeaderForm.get('isChargeable').setValue('');

      this.customerDtList = [];
      this.sizeList = [];
      this.colorList = [];
      this.customerUserList = [];
      this.customerCurrList = [];
      this.divisionList = [];

      this.clearItemControls();
      this.clearDeliveryControls();

      this.soItemList = [];
      this.soDelivList = [];
    } else {
      this.loadSalesOrderDt();
    }
  }

   //// LOADS CATEGORY
   loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
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

  onSelectCategory(event) {
    this.articleForm.get('prodType').reset();
    this.articleForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  onSelectProdType(event) {
    this.articleForm.get('prodGroup').reset();
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
        categoryId: this.articleForm.get('category').value[0],
        proTypeId: this.articleForm.get('prodType').value[0],
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
            var autoId = 0,
              flexLine = [];
            // console.log(articles);
  
            ///// Get Unique Article List
            var uniqeArticle = articles.filter(
              (arr, index, self) =>
                index === self.findIndex((t) => t.autoId === arr.autoId)
            );
  
            ///// PUSH FLEX FIELD ARTICLE LIST
            for (let b = 0; b < uniqeArticle.length; b++) {
              autoId = uniqeArticle[b]['autoId'];
              var fieldLine: any = uniqeArticle[b]; 
              
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
  }

  loadSalesCategory() {
    this.masterServices.getSalesCategory().subscribe((salesCat) => {
      this.salesCatList = salesCat;
    });
  }

  loadPaymentTerms() {
    this.masterServices.getPaymentTerms().subscribe((payTerms) => {
      this.payTermsList = payTerms;
    });
  }

  loadCountries() {
    this.masterServices.getCountries().subscribe((countries) => {
      this.countryList = countries;
    });
    //console.log(this.countryList);
  }

  loadSalesAgent() {
    this.salesAgentList = [];
    var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = user.locationId;
    this.masterServices.getSalesAgent(locationId).subscribe((agents) => {
      this.salesAgentList = agents;
    });
    //console.log(this.salesAgentList);
  }

  getSalesOrderRefNo() {
    this.soHeaderForm.get('orderRef').setValue('');
    this.salesOrderServices.getSalesOrderRef().subscribe((refNo) => {
      //console.log(refNo.orderRef);
      this.soHeaderForm.get('orderRef').setValue(refNo.orderRef.toString());
    });
  }

  loadCustomer() {
    var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
    });
  }

  loadCustomerDt(event) {
    for (const item of event.added) {
      /// loads CUSTOMER LOACTION
      this.masterServices.getCustomerLocation(item).subscribe(
        (customerDt) => {
          this.customerDtList = customerDt;
        },
        // The 2nd callback handles errors.
        (err) => console.error(err),
        // The 3rd callback handles the "complete" event.
        () => {
          // console.log('location');
        }
      );

      /// LOADS CUSTOMER USERS
      this.masterServices.getCustomerUser(item).subscribe((customerUser) => {
        this.customerUserList = customerUser;
      });

      //// LOADS CUSTOMER CURRENCY
      this.masterServices.getCustomCurrency(item).subscribe((customerCurr) => {
        this.customerCurrList = customerCurr;
        // console.log(this.customerCurrList);
      });
      

      //// LOADS CUSTOMER DIVISION
      this.masterServices.getCustomerDivision(item).subscribe((customerDivi) => {
          this.divisionList = customerDivi;
        });
      //console.log(this.divisionList);
    }
  }

 /// SELECT ARTICLE IN MODAL AND LOADS DATA TO ARTICLE FORM
  selectArticle(event, cellId) {
    /// CLEAR CONTROLS AND GRIDS
    // this.clearDeliveryControls();
    // this.clearItemControls();
    // this.soItemList = [];
    // this.soDelivList = [];
    // this.showArtiForm = true;

    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var articleId = selectedRowData[0]['autoId'];
    //console.log(selectedRowData);
    this.soItemForm.get('articleId').setValue(selectedRowData[0]['autoId']);
    this.soItemForm.get('articleName').setValue(selectedRowData[0]['articleName']);
    this.soItemForm.get('articleCode').setValue(selectedRowData[0]['stockCode']);  

    this.articleDialog.close();
    this.loadColor(articleId);
    this.loadSize(articleId);
  }

  loadColor(articleId) {
    this.colorList = [];
    this.soItemForm.get('colorId').setValue('');
    //console.log(item);
    this.masterServices.getArticleColor(articleId).subscribe((color) => {
      this.colorList = color;
      console.log(this.colorList);
    });
  }

  loadSize(articleId) {
    this.sizeList = [];
    this.soItemForm.get('sizeId').setValue('');
    this.masterServices.getArticleSize(articleId).subscribe((size) => {
      this.sizeList = size;
    });
  }

  onClearArticle(){
    this.soItemForm.get('articleId').setValue(0);
    this.soItemForm.get('articleName').setValue('');
    this.soItemForm.get('articleCode').setValue('');
  }

  /// ADD NEW ITEM TO GRID / UPDATE
  addItemRow() {
    if (this.checkIsEditable()) {
      //console.log(this.soItemForm.value);
      var status = true;
      var itemId = this.soItemForm.get('itemId').value;
      var qty = this.soItemForm.get('qty').value;
      var price = this.soItemForm.get('price').value;
      var soHeaderId = this.soHeaderForm.get('headerId').value;

      //console.log(itemId);
      //// EXISTING ITEM IN ITEM GRID
      if (itemId != 0) {
        /// CHECK IF IT IS A INITIAL SALES ORDER
        if (soHeaderId > 0) {
          /// CHECK ITEM IS EXISTS IN Delivery Grid
          if (!this.checkDeliveryQty(itemId, qty)) {
            this.toastr.warning('Qty cannot be lesser than delivery qty !!!');
            return;
          }
        }

        this.itemGrid.updateCell(qty, itemId, 'qty');
        this.itemGrid.updateCell(price, itemId, 'price');
      } else {
        /// INITIAL TIME BLOCK DELIVERY BREACKDOWN
        if ( this.soHeaderForm.get('headerId').value == 0 )
          status = true;
        else 
          status = false;

        //// ADD NEW ITEM ENTRY
        itemId = this.findMaxItemId(this.itemGrid.data) + 1;
        //console.log(itemId);
        //itemId = this.itemGrid.dataLength + 1;
        var articleId = this.soItemForm.get('articleId').value;
        var colorId = this.soItemForm.get('colorId').value[0];
        var sizeId = this.soItemForm.get('sizeId').value[0];

        //// CHECK IF IT IS EXISTING ITEM DETAILS
        const ItemRowData = this.itemGrid.data.filter((record) => {
          return (
            record.articleId == articleId &&
            record.colorId == colorId &&
            record.sizeId == sizeId
          );
        });

        if (ItemRowData.length > 0) {
          this.toastr.warning('record added already !!!');
          return;
        } else {
          var obj = {
            itemId: itemId,
            sizeId: sizeId,
            size: this.cmbsize.value,
            colorId: colorId,
            color: this.cmbcolor.value,
            articleId: articleId,
            articleName: this.soItemForm.get('articleName').value,
            articleCode: this.soItemForm.get('articleCode').value,
            costingId: 0,
            costRef: ' ',
            qty: qty,
            price: price,
            isIntendCreated: false,
            status: status,
          };
          // console.log(obj);
          this.itemGrid.addRow(obj);
        }
      }
      this.clearItemControls();
    }
  }

  //// CHECK DELIVERY QTY IS EXISTS WHEN ADDING ITEM QTY TO THE GRID
  checkDeliveryQty(itemId, totalQty) {
    var delTotQty: number = 0;
    //// EXTRACT RELATED ITEMS
    const delivRowData = this.deliveryGrid.data.filter((record) => {
      return record.itemId == itemId;
    });

    /// Check item already added in delivery breakdown then get the added deliv qty
    if (delivRowData.length > 0) {
      for (let index = 0; index < delivRowData.length; index++) {
        delTotQty = delTotQty + parseInt(delivRowData[index]['qty']);
      }

      ///// check sum of the delivery breakdown equeal to item qty
      ///// update the status
      if (delTotQty == totalQty) {
        this.itemGrid.updateCell(true, itemId, 'status');
      } else {
        this.itemGrid.updateCell(false, itemId, 'status');
      }

      //// item qty can not be lesser then delivery qty
      if (totalQty < delTotQty) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  /// Add article to delivery breakdown section
  onAddItemToDelivery(event, cellId) {
    if (this.checkIsEditable()) {
      this.clearDeliveryControls();
      const ids = cellId.rowID;
      const selectedRowData = this.itemGrid.data.filter((record) => {
        return record.itemId == ids;
      });

      var isIntent = selectedRowData[0]['isIntendCreated'];
      if (isIntent == false) {
        //// fill article details from item details
        this.soDeliveyForm.get('itemId').setValue(selectedRowData[0]['itemId']);
        this.soDeliveyForm.get('articleId').setValue(selectedRowData[0]['articleId']);
        this.soDeliveyForm.get('articleName').setValue(selectedRowData[0]['articleName']);
        this.soDeliveyForm.get('color').setValue(selectedRowData[0]['color']);
        this.soDeliveyForm.get('size').setValue(selectedRowData[0]['size']);
        this.transferItem = selectedRowData;
      } else {
        this.toastr.warning('Intent already created !!!');
      }
    }
  }

  clearItemControls() {
    //this.masterColor.reset();
    this.soItemForm.get('itemId').setValue(0);
    // this.soItemForm.get('articleId').setValue('');
    // this.soItemForm.get('articleName').setValue('');
    // this.soItemForm.get('articleCode').setValue('');
    this.soItemForm.get('colorId').setValue('');
    this.soItemForm.get('sizeId').setValue('');
    this.soItemForm.get('qty').setValue('');
    this.soItemForm.get('price').setValue('');
    // this.showArticle = true;
    this.showColor = true;
    this.showSize = true;

    // this.soItemForm.get('articleId').enable();
    this.soItemForm.get('colorId').enable();
    this.soItemForm.get('sizeId').enable();
  }

  /// Item delete event
  onItemDelete(event, cellId) {
    if (this.checkIsEditable()) {
      //console.log(cellId.rowID);
      const ids = cellId.rowID;
      this.rowId = 0;
      this.btnStatus = '';
      const selectedRowData = this.itemGrid.data.filter((record) => {
        return record.itemId == ids;
      });

      var isIntent = selectedRowData[0]['isIntendCreated'];
      var articleId = selectedRowData[0]['articleId'];
      var colorId = selectedRowData[0]['colorId'];
      var sizeId = selectedRowData[0]['sizeId'];

      if (isIntent == false) {
        const ItemRowData = this.deliveryGrid.data.filter((record) => {
          return (
            record.articleId == articleId &&
            record.colorId == colorId &&
            record.sizeId == sizeId
          );
        });

        if (ItemRowData.length > 0) {
          this.toastr.warning('Delete Delivery items first !!!');
        } else {
          this.itemGrid.deleteRow(ids);
        }
      } else {
        this.toastr.warning('Delete Intent first !!!');
      }
    }
  }

  // LoadDelRef() {
  //   this.delRef = [
  //     { delRef: 'D1' },
  //     { delRef: 'D2' },
  //     { delRef: 'D3' },
  //     { delRef: 'D4' },
  //     { delRef: 'D5' },
  //   ];
  // }

  ///// Delivery section delete delivery details
  onDeliveryDelete(event, cellId) {
    if (this.checkIsEditable()) {
      this.clearDeliveryControls();
      //console.log(cellId.rowID);
      const rowIndex = cellId.rowID;
      this.rowId = 0;
      this.btnStatus = '';

      const selectedRowData = this.deliveryGrid.data.filter((record) => {
        return record.deliveryId == rowIndex
      });
      // console.log(selectedRowData);

      if (selectedRowData.length > 0) {   
        var itemId = parseInt(selectedRowData[0]['itemId']);

        /// CHECK IF INTENT IS CREATED
        const itemRowData = this.itemGrid.data.filter((record) => {
          return record.itemId == itemId && record.isIntendCreated == true;
        });  

        if(itemRowData.length == 0) {
           ///// update the status of the item details        
          this.itemGrid.updateCell(false, itemId, 'status');
          /// DELETE DELVERY RECORDS
          this.deliveryGrid.deleteRow(rowIndex);
        } else {
          this.toastr.warning("Intent already created !!!");
        }
      }
    }
  }

  onDeliveryEdit(event, cellId) {
    if (this.checkIsEditable()) {
      this.clearDeliveryControls();
      // this.deliveryFormEnable();
      const ids = cellId.rowID;

      const selectedRowData = this.deliveryGrid.data.filter((record) => {
        return record.deliveryId == ids;
      });

      if (selectedRowData.length > 0) {
        var itemId = parseInt(selectedRowData[0]['itemId']);

         /// CHECK IF INTENT IS CREATED
        const itemRowData = this.itemGrid.data.filter((record) => {
          return record.itemId == itemId && record.isIntendCreated == true;
        });
        
        if(itemRowData.length == 0 ) {
          console.log(selectedRowData[0]);
          var trasDate: Date = new Date(selectedRowData[0]['deliveryDate']);

          this.soDeliveyForm.get('deliveryId').setValue(selectedRowData[0]['deliveryId']);
          this.soDeliveyForm.get('itemId').setValue(selectedRowData[0]['itemId']);
          this.soDeliveyForm.get('articleName').setValue(selectedRowData[0]['article']);
          this.soDeliveyForm.get('deliveryRef').setValue(selectedRowData[0]['deliveryRef']);
          this.soDeliveyForm.get('deliveryDate').setValue(trasDate);
          this.soDeliveyForm.get('color').setValue(selectedRowData[0]['color']);
          this.soDeliveyForm.get('size').setValue(selectedRowData[0]['size']);
          this.soDeliveyForm.get('qty').setValue(selectedRowData[0]['qty']);
          //this.soDeliveyForm.get('deliCustLocId').setValue(selectedRowData[0]['deliCustLocId']);
          this.delivLocation.setSelectedItem(selectedRowData[0]['deliCustLocId'],true);
        } else {
          this.toastr.warning("Intent already created !!!");
        }
      }
    }
    //this.deliveryRef.setSelectedItem(selectedRowData[0]['deliveryRef'], true);
    // this.cmbcolor.setSelectedItem(selectedRowData[0]["color"], true);
    // this.cmbsize.setSelectedItem(selectedRowData[0]["size"], true);
  }

  onItemEdit(event, cellId) {
    if (this.checkIsEditable()) {
      this.clearItemControls();
      this.soItemForm.get('colorId').disable();
      this.soItemForm.get('sizeId').disable();
      //this.showArticle = false;
      this.showColor = false;
      this.showSize = false;

      const ids = cellId.rowID;
      const selectedRowData = this.itemGrid.data.filter((record) => {
        return record.itemId == ids ;
      });

      var isIntendCreated = selectedRowData[0]['isIntendCreated'];

      //// CHECK IF INTENT IS CREATED OR NOT 
      if(isIntendCreated == false) {
         // console.log(selectedRowData);
        this.soItemForm.get('itemId').setValue(selectedRowData[0]['itemId']);
        this.soItemForm.get('articleId').setValue(selectedRowData[0]['articleId']);
        this.soItemForm.get('articleCode').setValue(selectedRowData[0]['articleCode']);
        this.soItemForm.get('articleName').setValue(selectedRowData[0]['articleName']);
        this.soItemForm.get('colorId').setValue(selectedRowData[0]['color']);
        this.soItemForm.get('sizeId').setValue(selectedRowData[0]['size']);
        this.soItemForm.get('qty').setValue(selectedRowData[0]['qty']);
        this.soItemForm.get('price').setValue(selectedRowData[0]['price']);
      } else {
        this.toastr.warning("Intent already created !!!");
      }
      // this.cmbarticle.setSelectedItem(selectedRowData[0]["article"], true);
      // this.cmbcolor.setSelectedItem(selectedRowData[0]["color"], true);
      // this.cmbsize.setSelectedItem(selectedRowData[0]["size"], true);
    }
  }

  //// add delivery breakdown items
  addDeliveryItemRow() {
    if (this.checkIsEditable()) {
      var totalQty: number = 0,
        itemQty: number = 0,
        status: boolean = false;
      var deliveryId = this.soDeliveyForm.get('deliveryId').value;
      var qty = this.soDeliveyForm.get('qty').value;
      var article = this.soDeliveyForm.get('articleName').value;
      var color = this.soDeliveyForm.get('color').value;
      var size = this.soDeliveyForm.get('size').value;
      var deliveryRef = this.soDeliveyForm.get('deliveryRef').value;
      var deliveryDate = this.soDeliveyForm.get('deliveryDate').value;
      var delFormatDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
      var deliCustLocId = this.soDeliveyForm.get('deliCustLocId').value[0];

      /// EXTRACT SELECTED ITEM DETAILS
      var itemId = this.soDeliveyForm.get('itemId').value;

      /// get total qty with currently added qty
      totalQty = totalQty + parseInt(qty);

      //console.log(itemQty + ' - ' + totalQty + ' - ' + itemId);
      //// EXTRACT RELATED ITEMS qty
      const ItemRowData = this.itemGrid.data.filter((record) => {
        return record.itemId == itemId;
      });

      if (ItemRowData.length > 0) {
        itemQty = itemQty + parseInt(ItemRowData[0]['qty']);
      }
      //console.log(deliveryId);
      ///// GET other item related qty omits selected delivery
      const deliveryRowData = this.deliveryGrid.data.filter((record) => {
        return record.itemId == itemId && record.deliveryId != deliveryId;
      });

      // console.log(deliveryRowData);
      if (deliveryRowData.length > 0) {
        for (let index = 0; index < deliveryRowData.length; index++) {
          totalQty = totalQty + parseInt(deliveryRowData[index]['qty']);
        }
      }
      //console.log(itemQty + ' - ' + totalQty + ' - ' + itemId);

      //// check total qty exceed the item qty
      if (totalQty > itemQty) {
        this.toastr.warning('Delivery Qty exceed than Item qty !!!');
        return;
      } else {
        if (totalQty == itemQty) {
          status = true;
        }
        /// EDIT ITEM GRID STATUS
        this.itemGrid.updateCell(status, itemId, 'status');

        // edit delivery item
        if (deliveryId != 0) {
          //console.log(status);
          //   var totDelQty = parseInt(prvQty) + parseInt(qty);
          this.deliveryGrid.updateCell(parseInt(qty), deliveryId, 'qty');
          this.deliveryGrid.updateCell(deliveryRef, deliveryId, 'deliveryRef');
          this.deliveryGrid.updateCell(
            delFormatDate,
            deliveryId,
            'deliveryDate'
          );
          this.deliveryGrid.updateCell(
            deliCustLocId,
            deliveryId,
            'deliCustLocId'
          );
          this.deliveryGrid.updateCell(
            this.delivLocation.value,
            deliveryId,
            'deliCustLoc'
          );
          //console.log(deliCustLocId);
          //console.log(this.deliveryGrid.data);
        } else {
          //// insert new delivery qty
          var articleId = this.transferItem[0]['articleId'];
          var colorId = this.transferItem[0]['colorId'];
          var sizeId = this.transferItem[0]['sizeId'];
          deliveryId = this.findMaxDelId(this.deliveryGrid.data) + 1;
          //deliveryId = this.deliveryGrid.dataLength + 1;

          var obj = {
            itemId: itemId,
            deliveryId: deliveryId,
            sizeId: sizeId,
            size: size,
            colorId: colorId,
            color: color,
            articleId: articleId,
            article: article,
            deliveryRef: deliveryRef,
            deliveryDate: delFormatDate,
            qty: parseInt(qty),
            deliCustLocId: deliCustLocId,
            deliCustLoc: this.delivLocation.value,
            jobQty: 0,
          };

          this.deliveryGrid.addRow(obj);
        }
      }
      this.clearDeliveryControls();
    }
  }

  /// GET MAXIMUMUM DELEIVERY ID
  findMaxDelId(arr) {
    var maxValue: number = 0;
    //console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      //console.log(arr[i].deliveryId);
      if (arr[i].deliveryId > maxValue) {
        maxValue = arr[i].deliveryId;
      }
    }
    //console.log(maxValue);
    return maxValue;
  }

  //// GET MAXIUMUM ITEM ID
  findMaxItemId(arr) {
    var maxValue: number = 0;
    //console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      //console.log(arr[i].deliveryId);
      if (arr[i].itemId > maxValue) {
        maxValue = arr[i].itemId;
      }
    }
    //console.log(maxValue);
    return maxValue;
  }

  clearDeliveryControls() {
    //this.soDeliveyForm.reset();
    this.soDeliveyForm.get('itemId').setValue(0);
    this.soDeliveyForm.get('deliveryId').setValue(0);
    this.soDeliveyForm.get('articleId').setValue('');
    this.soDeliveyForm.get('articleName').setValue('');
    this.soDeliveyForm.get('color').setValue('');
    this.soDeliveyForm.get('size').setValue('');
    this.soDeliveyForm.get('qty').setValue('');
    this.soDeliveyForm.get('deliveryRef').setValue('');
    this.soDeliveyForm.get('deliveryDate').setValue('');
    this.soDeliveyForm.get('deliCustLocId').setValue(0);
  }

  /// SAVE SALES ORDER
  saveSalesOrder() {
    if (this.validateSalesOrder() && this.checkIsEditable()) {
      var salesOrderList = [],
        itemOrderList = [];

      //console.log(this.chkIsCharge.checked);
      ////--------=========== SALES ORDER HEADER =======================---------
      var headerData = {
        autoId: this.soHeaderForm.get('headerId').value,
        orderRef: this.soHeaderForm.get('orderRef').value,
        customerRef: this.soHeaderForm.get('customerRef').value,
        customerId: this.soHeaderForm.get('customerId').value[0],
        customerUserId: this.soHeaderForm.get('customerUserId').value[0],
        salesCategoryId: this.soHeaderForm.get('salesCategoryId').value[0],
        cusCurrencyId: this.soHeaderForm.get('cusCurrencyId').value[0],
        countryId: this.soHeaderForm.get('countryId').value[0],
        paymentTermId: this.soHeaderForm.get('paymentTermId').value[0],
        salesAgentId: this.soHeaderForm.get('salesAgentId').value[0],
        isChargeable: this.chkIsCharge.checked,
        customerLocId: this.soHeaderForm.get('customerLocId').value[0],
        delDate: this.datePipe.transform(
          this.soHeaderForm.get('delDate').value,
          'yyyy-MM-dd'
        ),
        createUserId: this.user.userId,
        // articleId: this.articleForm.get('articleId').value,
        customerDivId: this.soHeaderForm.get('customerDivId').value[0],
      };

      var objHead = {
        SalesOrderHd: headerData,
      };

      salesOrderList.push(objHead);

      ////--------=========== SALES ORDER ITEMS =======================---------
      var itemRows = this.itemGrid.data;

      itemRows.forEach((items) => {
        var itemdata = {
          autoId: items.itemId,
          articleId: items.articleId,
          sizeId: items.sizeId,
          colorId: items.colorId,
          costingId: items.costingId,
          qty: items.qty,
          isIntendCreated: items.isIntendCreated,
          price: items.price,
        };
        itemOrderList.push(itemdata);
      });

      var objItem = {
        SalesItemDt: itemOrderList,
      };

      salesOrderList.push(objItem);

      ////--------=========== SALES ORDER DELIVERY BREKDOWN =======================---------
      var deliveryRows = this.deliveryGrid.data;
      deliveryRows.forEach((delivery) => {
        var deliverydata = {
          autoId: delivery.deliveryId,
          soItemDtId: delivery.itemId,
          //articleId: delivery.articleId,
          // sizeId: delivery.sizeId,
          // colorId: delivery.colorId,
          deliveryRef: delivery.deliveryRef,
          deliveryDate: delivery.deliveryDate,
          qty: delivery.qty,
          customerLocId: delivery.deliCustLocId,
          //price: delivery.price,
        };
        salesOrderList.push(deliverydata);
      });

      // console.log(salesOrderList);
      // // //console.log(JSON.stringify(menuList));

      this.salesOrderServices
        .saveSalesOrder(salesOrderList)
        .subscribe((result) => {
          //console.log(result);
          if (result['result'] == 1) {
            this.toastr.success('Sales Order save Successfully !!!');
            this.soHeaderForm.get('headerId').setValue(result['refNumId']);
            this.soHeaderForm.get('orderRef').setValue(result['refNum']);
            this.loadSalesOrderDt();
          } else if (result['result'] == -1) {
            this.toastr.success('Sales Order update Successfully !!!');
            this.loadSalesOrderDt();
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result['result'].toString()
            );
          }
        });
    }
  }

  /// LOADS EXISTING SALES ORDER DETAILS
  loadSalesOrderDt() {
    this.clearDeliveryControls();
    this.clearItemControls();
    this.soItemList = [];
    this.soDelivList = [];
    this.isView = true;
    //var locationId = 0;

    //// validate sales order number is exists
    if (this.soHeaderForm.get('orderRef').value != '') {
      // this.deliveryFormDisable();
      var salesOrderRef = this.soHeaderForm.get('orderRef').value;

      this.salesOrderServices.getSalesOrderDT(salesOrderRef).subscribe(
        (orderDt) => {
          // console.log(orderDt);
          var salesOrderId = 0,
            soSavedItemList = [],
            soSavedDelList = [];

          if (orderDt.length > 0) {
            for (let index = 0; index < orderDt.length; index++) {
              ////========= SET SALESORDER HEDER ================
              if (index == 0) {
                salesOrderId = parseInt(orderDt[index]['soHeaderId']);
                var delDate: Date = new Date(
                  this.datePipe.transform(
                    orderDt[index]['delDate'],
                    'yyyy-MM-dd'
                  )
                );
                var trnsDate: Date = new Date(
                  this.datePipe.transform(
                    orderDt[index]['trnsDate'],
                    'yyyy-MM-dd'
                  )
                );

                this.soHeaderForm
                  .get('headerId')
                  .setValue(orderDt[index]['soHeaderId']);
                this.soHeaderForm
                  .get('customerRef')
                  .setValue(orderDt[index]['customerRef']);
                //this.soHeaderForm.get('customerId').setValue(orderDt[index]["customerId"]);
                //this.soHeaderForm.get('customerLocId').setValue(orderDt[index]["customerLocId"]);
                this.cuslocationId = orderDt[index]['customerLocId'];
                this.cuscusCurrencyId = orderDt[index]['cusCurrencyId'];
                this.cusDivisionId = orderDt[index]['customerDivId'];
                this.cusUserId = orderDt[index]['customerUserId'];

                this.customer.setSelectedItem(
                  orderDt[index]['customerId'],
                  true
                );
                this.location.setSelectedItem(
                  orderDt[index]['customerLocId'],
                  true
                );
                this.salesCat.setSelectedItem(
                  orderDt[index]['salesCategoryId'],
                  true
                );
                this.countries.setSelectedItem(
                  orderDt[index]['countryId'],
                  true
                );
                this.payTerms.setSelectedItem(
                  orderDt[index]['paymentTermId'],
                  true
                );
                this.users.setSelectedItem(
                  orderDt[index]['customerUserId'],
                  true
                );
                this.currency.setSelectedItem(
                  orderDt[index]['cusCurrencyId'],
                  true
                );
                this.division.setSelectedItem(
                  orderDt[index]['customerDivId'],
                  true
                );
                this.salesAgents.setSelectedItem(
                  orderDt[index]['salesAgentId'],
                  true
                );

                this.chkIsCharge.checked = orderDt[index]['isChargeable'];

                this.soHeaderForm.get('delDate').setValue(delDate);
                this.soHeaderForm.get('trnsDate').setValue(trnsDate);

                //// LOADS ARTICLE DETAILS
                // this.articleForm.get('articleId').setValue(orderDt[index]['articleId']);
                // this.articleForm.get('articleName').setValue(orderDt[index]['article']);
                // this.articleForm.get('articleDes1').setValue(orderDt[index]['description1']);
                // this.articleForm.get('articleDes2').setValue(orderDt[index]['description2']);
                // this.articleForm.get('articleCode').setValue(orderDt[index]['stockCode']);
                // this.articleForm.get('category').setValue(orderDt[index]['category']);
                // this.articleForm.get('unit').setValue(orderDt[index]['unitCode']);
                // this.articleForm.get('prodGroup').setValue(orderDt[index]['prodGroupName']);
                // this.articleForm.get('prodType').setValue(orderDt[index]['prodTypeCode']);

                //// LOADS COLOR AND SIZE
                // this.loadColor(orderDt[index]['articleId']);
                // this.loadSize(orderDt[index]['articleId']);
              }

              /// check item already added to the grid or not
              var result = soSavedItemList.filter(
                (x) => x.itemId == orderDt[index]['soItemId']
              );
              //console.log(result.length);

              if (result.length == 0) {
                /// ========= SET SALES ORDER ITEM ================
                var orderItem = {
                  itemId: orderDt[index]['soItemId'],
                  sizeId: orderDt[index]['sizeId'],
                  size: orderDt[index]['size'],
                  colorId: orderDt[index]['colorId'],
                  color: orderDt[index]['color'],
                  articleId: orderDt[index]['articleId'],
                  articleName: orderDt[index]['article'],
                  articleCode : orderDt[index]['stockCode'],                 
                  costingId: orderDt[index]['costingId'],
                  costRef: orderDt[index]['costRef'],
                  qty: orderDt[index]['itemQty'],
                  price: orderDt[index]['price'],
                  //saleOrderId: salesOrderId,
                  isIntendCreated: orderDt[index]['isIntendCreated'],
                  status: true,
                };
                //console.log(orderItem);
                soSavedItemList.push(orderItem);
              }

              ///// ========= SET SALES ORDER DELIVERY BREAKDOWN ================
              //var delvDate: Date = new Date(this.datePipe.transform(orderDt[index]["deliveryDate"],"yyyy-MM-dd"));
              //console.log(orderDt[index]);
              var orderDeliv = {
                deliveryId: orderDt[index]['soDelId'],
                sizeId: orderDt[index]['sizeId'],
                size: orderDt[index]['size'],
                colorId: orderDt[index]['colorId'],
                color: orderDt[index]['color'],
                articleId: orderDt[index]['articleId'],
                article: orderDt[index]['article'],
                itemId: orderDt[index]['soItemId'],
                deliveryRef: orderDt[index]['deliveryRef'],
                deliCustLocId: orderDt[index]['deliCustLocId'],
                deliCustLoc: orderDt[index]['cusDelLoc'],
                deliveryDate: this.datePipe.transform(
                  orderDt[index]['deliveryDate'],
                  'yyyy-MM-dd'
                ),
                qty: orderDt[index]['delQty'],
                jobQty: orderDt[index]['jobQty'],
              };

              if (orderDt[index]['jobQty'] > 0) this.isJobCreated = true;              

              soSavedDelList.push(orderDeliv);
            }
            this.soItemList = soSavedItemList;
            this.soDelivList = soSavedDelList;

            // console.log(this.deliveryGrid.data);
          }
        },
        (err) => console.error(err),
        () => {
          this.customer.disabled = true;
          this.soHeaderForm.get('customerRef').disable();
          this.setComboValues();
          // console.log('observable complete');
          // this.location.triggerCheck();
        }
      );
    } else {
      this.toastr.info('Enter sales-order No !!!');
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setComboValues() {
    setTimeout(() => {
      //console.log("pending");
      this.location.setSelectedItem(this.cuslocationId, true);
      this.currency.setSelectedItem(this.cuscusCurrencyId, true);
      this.division.setSelectedItem(this.cusDivisionId, true);
      this.users.setSelectedItem(this.cusUserId, true);
    }, 2000);
  }

  ///// VALIDATION BEFORE SAVE SALES ORDER
  validateSalesOrder() {
    var salesHeaderId = parseInt(this.soHeaderForm.get('headerId').value);

    if (this.itemGrid.dataLength > 0) {
      //// Initial Sales Order Saving don't wanna check delivery break down
      if (salesHeaderId == 0) {
        return true;
      } else {
        //// check delivery breakdown is exists or not
        if (this.deliveryGrid.dataLength > 0) {
          ///// check unbalance item is exists or not
          const selectedRowData = this.itemGrid.data.filter((record) => {
            return record.status == false;
          });

          if (selectedRowData.length > 0) {
            this.toastr.info('Invalid delivery breakdown !!!');
            return false;
          } else {
            return true;
          }
        } else {
          this.toastr.info('Fill delivery breakdown !!!');
          return false;
        }
      }
    } else {
      this.toastr.info('Fill Items breakdown !!!');
      return false;
    }
  }

  refreshSalesOrder() {
    // console.log('here');
    //this.isNewSO = true;
    this.isView = false;
    // this.deliveryFormDisable();
    this.customer.disabled = false;
    this.soHeaderForm.get('customerRef').enable();
    this.articleForm.reset();
    this.isJobCreated = false;
    // this.isIntentCreated == false;
    var date: Date = new Date(Date.now());

    this.soHeaderForm.get('headerId').setValue(0);
    this.soHeaderForm.get('customerRef').setValue('');
    this.soHeaderForm.get('customerId').setValue('');
    this.soHeaderForm.get('customerLocId').setValue('');
    this.soHeaderForm.get('trnsDate').setValue(date);
    this.soHeaderForm.get('delDate').setValue('');
    this.soHeaderForm.get('customerUserId').setValue('');
    this.soHeaderForm.get('salesCategoryId').setValue('');
    this.soHeaderForm.get('salesAgentId').setValue('');
    this.soHeaderForm.get('cusCurrencyId').setValue('');
    this.soHeaderForm.get('countryId').setValue('');
    this.soHeaderForm.get('paymentTermId').setValue('');
    this.soHeaderForm.get('customerDivId').setValue('');
    this.soHeaderForm.get('isChargeable').setValue('');

    this.customerDtList = [];
    this.sizeList = [];
    this.colorList = [];
    this.customerUserList = [];
    this.customerCurrList = [];
    this.divisionList = [];

    this.getSalesOrderRefNo();
    this.clearItemControls();
    this.clearDeliveryControls();

    this.soItemForm.get('articleId').setValue(0);
    this.soItemForm.get('articleName').setValue('');
    this.soItemForm.get('articleCode').setValue('');

    this.soItemList = [];
    this.soDelivList = [];
  }

  openItemDialog(event, cellId) {
    if (this.checkIsEditable()) {
      this.rowId = cellId;
      this.btnStatus = 'I';
      this.dialog.open();
    }
  }

  openDelivDialog(event, cellId) {
    if (this.checkIsEditable()) {
      this.rowId = cellId;
      this.btnStatus = 'D';
      this.dialog.open();
    }
  }

  onDialogOKSelected(event) {
    event.dialog.close();
    //console.log(this.rowId);
    if (this.btnStatus == 'I') this.onItemDelete(event, this.rowId);
    else if (this.btnStatus == 'D') this.onDeliveryDelete(event, this.rowId);
  }

  /// CHECK IF SALES ORDER IS EDITABLE OR NOT
  checkIsEditable() {
    if (this.isJobCreated == true) {
      this.toastr.warning('Job already created');
      return false;
    } 
    // else if(this.isIntentCreated == true) {
    //   this.toastr.warning('Intent already created');
    //   return false;
    // }

    return true;
  }
}
