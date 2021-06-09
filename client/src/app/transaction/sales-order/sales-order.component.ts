import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IComboSelectionChangeEventArgs,
  IgxColumnComponent,
  IgxComboComponent,
  IgxDialogComponent,
  IgxGridComponent,
} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { CustomerDt } from 'src/app/_models/customerDt';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Size } from 'src/app/_models/size';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { ConfirmationDialogService } from '_services/confirmation-dialog.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css'],
})
export class SalesOrderComponent implements OnInit {
  soHeaderForm: FormGroup;
  soItemForm: FormGroup;
  soDeliveyForm: FormGroup;
  soDelivList: any[];
  delRef = [];
  transferItem: any;
  articleList: Article[];
  //delArticle: Article;
  colorList: Color[];
  sizeList: Size[];
  soItemList: any[];
  user: User;
  customerList: CustomerHd[];
  customerDtList: CustomerDt[];
  validationErrors: string[] = [];
  public date: Date = new Date(Date.now());
  showArticle: boolean = true;
  showColor: boolean = true;
  showSize: boolean = true;
  btnStatus: string = '';
  rowId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('itemGrid', { static: true })
  public itemGrid: IgxGridComponent;
  @ViewChild('cmbarticle', { read: IgxComboComponent })
  public cmbarticle: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;
  // @ViewChild('deliveryRef', { read: IgxComboComponent })
  // public deliveryRef: IgxComboComponent;
  @ViewChild('deliveryGrid', { static: true })
  public deliveryGrid: IgxGridComponent;
  @ViewChild('delArticle', { read: IgxComboComponent })
  public delArticle: IgxComboComponent;
  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('merchant', { read: IgxComboComponent })
  public merchant: IgxComboComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.soDeliveyForm.disable();
    this.getSalesOrderRefNo();
    this.LoadCustomer();
    this.LoadArticle();
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
      customerDtId: [''],
      trnsDate: [{ value: date, disabled: true }],
      delDate: ['', Validators.required],
    });

    this.soItemForm = this.fb.group({
      itemId: [0],
      articleId: ['', Validators.required],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      qty: ['', Validators.required],
    });

    this.soDeliveyForm = this.fb.group({
      itemId: [0],
      deliveryId: [0],
      article: [{ value: '', disabled: true }, Validators.required],
      color: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      qty: ['', Validators.required],
      deliveryRef: ['', Validators.required],
      deliveryDate: ['', Validators.required],
    });
  }

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

  //// ORDER REFERANCE NO KEY UP EVENT
  onKey(event: any) {
    this.soDeliveyForm.disable();
    var date: Date = new Date(Date.now());

    this.soHeaderForm.get('headerId').setValue(0);
    this.soHeaderForm.get('customerRef').setValue('');
    this.soHeaderForm.get('customerId').setValue('');
    this.soHeaderForm.get('customerDtId').setValue('');
    this.soHeaderForm.get('trnsDate').setValue(date);
    this.soHeaderForm.get('delDate').setValue('');
    this.customerDtList = [];

    this.clearItemControls();
    this.clearDeliveryControls();

    this.soItemList = [];
    this.soDelivList = [];
  }

  getSalesOrderRefNo() {
    this.soHeaderForm.get('orderRef').setValue('');
    this.salesOrderServices.getSalesOrderRef().subscribe((refNo) => {
      //console.log(refNo.orderRef);
      this.soHeaderForm.get('orderRef').setValue(refNo.orderRef.toString());
    });
  }

  LoadCustomer() {
    var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
    });
  }

  LoadCustomerDt(event) {
    for (const item of event.added) {
      //console.log(item);
      this.masterServices.getCustomerDt(item).subscribe((customerDt) => {
        this.customerDtList = customerDt;
      });
    }
  }

  LoadArticle() {
    this.masterServices.getArticles().subscribe((art) => {
      this.articleList = art;
      //console.log(this.articleList);
    });
  }

  LoadColor(event) {
    this.colorList = [];
    this.soItemForm.get('colorId').setValue('');
    for (const item of event.added) {
      //console.log(item);
      this.masterServices.getArticleColor(item).subscribe((color) => {
        this.colorList = color;
      });
    }
  }

  LoadSize(event) {
    this.sizeList = [];
    this.soItemForm.get('sizeId').setValue('');
    for (const item of event.added) {
      this.masterServices.getArticleSize(item).subscribe((size) => {
        this.sizeList = size;
        // console.log(this.sizeList);
      });
    }
  }

  addItemRow() {
    //console.log(this.soItemForm.value);
    var itemId = this.soItemForm.get('itemId').value;
    var qty = this.soItemForm.get('qty').value;

    //console.log(itemId);
    //// EXISTING ITEM IN ITEM GRID
    if (itemId != 0) {
      /// CHECK ITEM IS EXISTS IN Delivery Grid
      if (this.checkDeliveryQty(itemId, qty)) {
        this.itemGrid.updateCell(qty, itemId, 'qty');
      } else {
        this.toastr.warning('Qty cannot be lesser than delivery qty !!!');
        return;
      }
    } else {
      //// ADD NEW ITEM ENTRY
      itemId = this.findMaxItemId(this.itemGrid.data) + 1;
      //console.log(itemId);
      //itemId = this.itemGrid.dataLength + 1;
      var articleId = this.soItemForm.get('articleId').value[0];
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
          saleOrderId: 0,
          articleId: articleId,
          article: this.cmbarticle.value,
          costingId: 0,
          costRef: ' ',
          qty: qty,
          isIntendCreated: false,
          status: false,
        };
        this.itemGrid.addRow(obj);
      }
    }
    this.clearItemControls();
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
    this.clearDeliveryControls();
    const ids = cellId.rowID;
    const selectedRowData = this.itemGrid.data.filter((record) => {
      return record.itemId == ids;
    });

    //// fill article details from item details
    this.soDeliveyForm.get('itemId').setValue(selectedRowData[0]['itemId']);
    this.soDeliveyForm.get('article').setValue(selectedRowData[0]['article']);
    this.soDeliveyForm.get('color').setValue(selectedRowData[0]['color']);
    this.soDeliveyForm.get('size').setValue(selectedRowData[0]['size']);
    this.transferItem = selectedRowData;
  }

  clearItemControls() {
    //this.masterColor.reset();
    this.soItemForm.get('itemId').setValue(0);
    this.soItemForm.get('articleId').setValue('');
    this.soItemForm.get('colorId').setValue('');
    this.soItemForm.get('sizeId').setValue('');
    this.soItemForm.get('qty').setValue('');

    this.sizeList = [];
    this.colorList = [];
    this.showArticle = true;
    this.showColor = true;
    this.showSize = true;

    this.soItemForm.get('articleId').enable();
    this.soItemForm.get('colorId').enable();
    this.soItemForm.get('sizeId').enable();
  }

  /// Item delete event
  onItemDelete(event, cellId) {
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
    //console.log(cellId.rowID);
    const rowIndex = cellId.rowID;
    this.rowId = 0;
    this.btnStatus = '';

    const selectedRowData = this.deliveryGrid.data.filter((record) => {
      return record.deliveryId == rowIndex && record.jobCreated == false;
    });

    //console.log(selectedRowData);

    if (selectedRowData.length == 0) {
      this.toastr.warning('Delete fail. Job already created !!!');
    } else {
      ///// update the status of the item details
      var itemId = parseInt(selectedRowData[0]['itemId']);
      this.itemGrid.updateCell(false, itemId, 'status');

      /// DELETE DELVERY RECORDS
      this.deliveryGrid.deleteRow(rowIndex);
    }
  }

  onDeliveryEdit(event, cellId) {
    this.clearDeliveryControls();
    const ids = cellId.rowID;
    const selectedRowData = this.deliveryGrid.data.filter((record) => {
      return record.deliveryId == ids;
    });

    if (selectedRowData[0]['jobCreated'] == true) {
      this.toastr.warning('Edit fail. Job already created !!!');
    } else {
      //console.log(selectedRowData[0]);
      var trasDate: Date = new Date(selectedRowData[0]['deliveryDate']);

      this.soDeliveyForm
        .get('deliveryId')
        .setValue(selectedRowData[0]['deliveryId']);
      this.soDeliveyForm.get('itemId').setValue(selectedRowData[0]['itemId']);
      this.soDeliveyForm.get('article').setValue(selectedRowData[0]['article']);
      this.soDeliveyForm
        .get('deliveryRef')
        .setValue(selectedRowData[0]['deliveryRef']);
      this.soDeliveyForm.get('deliveryDate').setValue(trasDate);
      this.soDeliveyForm.get('color').setValue(selectedRowData[0]['color']);
      this.soDeliveyForm.get('size').setValue(selectedRowData[0]['size']);
      this.soDeliveyForm.get('qty').setValue(selectedRowData[0]['qty']);
    }
    //this.deliveryRef.setSelectedItem(selectedRowData[0]['deliveryRef'], true);
    // this.cmbcolor.setSelectedItem(selectedRowData[0]["color"], true);
    // this.cmbsize.setSelectedItem(selectedRowData[0]["size"], true);
  }

  onItemEdit(event, cellId) {
    this.clearItemControls();
    this.showArticle = false;
    this.showColor = false;
    this.showSize = false;

    const ids = cellId.rowID;
    const selectedRowData = this.itemGrid.data.filter((record) => {
      return record.itemId == ids;
    });

    //console.log(selectedRowData[0]['colorId']);
    this.soItemForm.get('itemId').setValue(selectedRowData[0]['itemId']);
    this.soItemForm.get('articleId').setValue(selectedRowData[0]['article']);
    this.soItemForm.get('colorId').setValue(selectedRowData[0]['color']);
    this.soItemForm.get('sizeId').setValue(selectedRowData[0]['size']);

    // this.cmbarticle.setSelectedItem(selectedRowData[0]["article"], true);
    // this.cmbcolor.setSelectedItem(selectedRowData[0]["color"], true);
    // this.cmbsize.setSelectedItem(selectedRowData[0]["size"], true);
  }

  //// add delivery breakdown items
  addDeliveryItemRow() {
    var totalQty: number = 0,
      itemQty: number = 0,
      status: boolean = false;
    var deliveryId = this.soDeliveyForm.get('deliveryId').value;
    var qty = this.soDeliveyForm.get('qty').value;
    var article = this.soDeliveyForm.get('article').value;
    var color = this.soDeliveyForm.get('color').value;
    var size = this.soDeliveyForm.get('size').value;
    var deliveryRef = this.soDeliveyForm.get('deliveryRef').value;
    var deliveryDate = this.soDeliveyForm.get('deliveryDate').value;
    var delFormatDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
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
        this.deliveryGrid.updateCell(delFormatDate, deliveryId, 'deliveryDate');
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
          jobCreated: false,
        };

        this.deliveryGrid.addRow(obj);
      }
    }

    this.clearDeliveryControls();
  }

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
    //this.masterColor.reset();
    this.soDeliveyForm.get('itemId').setValue(0);
    this.soDeliveyForm.get('deliveryId').setValue(0);
    this.soDeliveyForm.get('article').setValue('');
    this.soDeliveyForm.get('color').setValue('');
    this.soDeliveyForm.get('size').setValue('');
    this.soDeliveyForm.get('qty').setValue('');
    this.soDeliveyForm.get('deliveryRef').setValue('');
    this.soDeliveyForm.get('deliveryDate').setValue('');
  }

  saveSalesOrder() {
    if (this.validateSalesOrder()) {
      var salesOrderList = [];
      ////--------=========== SALES ORDER HEADER =======================---------
      var headerData = {
        autoId: this.soHeaderForm.get('headerId').value,
        orderRef: this.soHeaderForm.get('orderRef').value,
        customerRef: this.soHeaderForm.get('customerRef').value,
        customerId: this.soHeaderForm.get('customerId').value[0],
        customerDtId: this.soHeaderForm.get('customerDtId').value[0],
        // trnsDate: this.datePipe.transform(
        //   this.soHeaderForm.get('trnsDate').value,
        //   'yyyy-MM-dd'
        // ),
        delDate: this.datePipe.transform(
          this.soHeaderForm.get('delDate').value,
          'yyyy-MM-dd'
        ),
        userId: this.user.userId,
        status: 'H',
      };
      salesOrderList.push(headerData);
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
          status: 'I',
        };
        salesOrderList.push(itemdata);
      });
      ////--------=========== SALES ORDER DELIVERY BREKDOWN =======================---------
      var deliveryRows = this.deliveryGrid.data;
      deliveryRows.forEach((delivery) => {
        var deliverydata = {
          autoId: delivery.deliveryId,
          soItemDtId: delivery.itemId,
          articleId: delivery.articleId,
          sizeId: delivery.sizeId,
          colorId: delivery.colorId,
          deliveryRef: delivery.deliveryRef,
          deliveryDate: delivery.deliveryDate,
          qty: delivery.qty,
          status: 'D',
        };
        salesOrderList.push(deliverydata);
      });

      //console.log(salesOrderList);
      // // //console.log(JSON.stringify(menuList));

      this.salesOrderServices
        .saveSalesOrder(salesOrderList)
        .subscribe((result) => {
          //console.log(result);
          if (result['result'] == 1) {
            this.toastr.success('Sales Order save Successfully !!!');
            this.soHeaderForm.get('headerId').setValue(result['SOHeaderId']);
            this.soHeaderForm.get('headerId').setValue(result['salesOrderRef']);
            this.loadSalesOrderDt();
          } else if (result['result'] == -1) {
            this.toastr.success('Sales Order update Successfully !!!');
            this.loadSalesOrderDt();
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        });
    }
  }

  loadSalesOrderDt() {
    this.clearDeliveryControls();
    this.clearItemControls();
    this.soItemList = [];
    this.soDelivList = [];

    this.soDeliveyForm.enable();
    //// validate sales order number is exists
    if (this.soHeaderForm.get('orderRef').value != '') {
      var salesOrderRef = this.soHeaderForm.get('orderRef').value;

      this.salesOrderServices
        .getSalesOrderDT(salesOrderRef)
        .subscribe((orderDt) => {
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
                //this.soHeaderForm.get('customerDtId').setValue(orderDt[index]["customerDtId"]);
                this.customer.setSelectedItem(
                  orderDt[index]['customerId'],
                  true
                );
                this.merchant.setSelectedItem(
                  orderDt[index]['customerDtId'],
                  true
                );
                this.soHeaderForm.get('delDate').setValue(delDate);
                this.soHeaderForm.get('trnsDate').setValue(trnsDate);
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
                  article: orderDt[index]['article'],
                  costingId: orderDt[index]['costingId'],
                  costRef: orderDt[index]['costRef'],
                  qty: orderDt[index]['itemQty'],
                  saleOrderId: salesOrderId,
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
                deliveryDate: this.datePipe.transform(
                  orderDt[index]['deliveryDate'],
                  'yyyy-MM-dd'
                ),
                qty: orderDt[index]['delQty'],
                jobCreated: orderDt[index]['jobCreated'],
              };

              soSavedDelList.push(orderDeliv);
            }
            this.soItemList = soSavedItemList;
            this.soDelivList = soSavedDelList;

            //console.log(this.soDelivList);
          }
        });
    } else {
      this.toastr.info('Enter sales-order No !!!');
    }
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
    //this.isNewSO = true;
    this.soDeliveyForm.disable();
    var date: Date = new Date(Date.now());

    this.soHeaderForm.get('headerId').setValue(0);
    this.soHeaderForm.get('customerRef').setValue('');
    this.soHeaderForm.get('customerId').setValue('');
    this.soHeaderForm.get('customerDtId').setValue('');
    this.soHeaderForm.get('trnsDate').setValue(date);
    this.soHeaderForm.get('delDate').setValue('');
    this.customerDtList = [];

    this.getSalesOrderRefNo();
    this.clearItemControls();
    this.clearDeliveryControls();

    this.soItemList = [];
    this.soDelivList = [];
  }

  openItemDialog(event, cellId) {
    this.rowId = cellId;
    this.btnStatus = 'I';
    this.dialog.open();
  }

  openDelivDialog(event, cellId) {
    this.rowId = cellId;
    this.btnStatus = 'D';
    this.dialog.open();
  }

  public onDialogOKSelected(event) {
    event.dialog.close();
    //console.log(this.rowId);
    if (this.btnStatus == 'I') this.onItemDelete(event, this.rowId);
    else if (this.btnStatus == 'D') this.onDeliveryDelete(event, this.rowId);
  }
}
