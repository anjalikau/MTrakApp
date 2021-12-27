import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Tax } from 'src/app/_models/tax';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  invoiceHdForm: FormGroup;
  invoiceDtForm: FormGroup;
  user: User;
  custometList: CustomerHd[];
  taxList: Tax[];
  addressList: any;
  pendInvoiceList: any;
  invoiceDtList: any;
  invoiceSumList: any;
  rowId: number = 0;
  saveButton: boolean = false;
  approveButton: boolean = false;
  public customOverlaySettings;
  taxAmount: number = 0;
  totalAmount: number = 0;
  grossAmount: number = 0;
  discount: number = 0;
  nbt: number = 0;
  nbtPr: number = 0;
  netAmount: number = 0;
  defCurrency: string = '';
  invoiceStatus: string = '';
  exchRate: number = 0;
  totNetValue: number = 0;
  totTaxValue: number = 0;
  paymentDue: string;
  billAddressId: number = 0;
  isApproved: boolean = false;
  isDisplayMode: boolean = false;
  printButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('pendInvoiceGrid', { read: IgxGridComponent, static: true })
  public pendInvoiceGrid: IgxGridComponent;
  @ViewChild('invoiceDtGrid', { read: IgxGridComponent, static: true })
  public invoiceDtGrid: IgxGridComponent;
  @ViewChild('invoiceSumGrid', { read: IgxGridComponent, static: true })
  public invoiceSumGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('confDialog', { read: IgxDialogComponent })
  public confDialog: IgxDialogComponent;

  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('billAddress', { read: IgxComboComponent })
  public billAddress: IgxComboComponent;
  @ViewChild('taxCode', { read: IgxComboComponent })
  public taxCode: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private masterServices: MasterService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private financeService: FinanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getInvoiceNo();
    this.loadCustomer();
    this.loadTax();
    this.loadDefaultCurrency();
  }

  public ngAfterViewInit() {
    this.customOverlaySettings = {
      outlet: this.invoiceDtGrid.outlet,
    };
  }

  /// DISPLAY TEXT ON GRID CELL
  public parseArray(
    arr: { description: string; lastInventory: string }[]
  ): string {
    // console.log(arr);
    return (arr || []).map((e) => e.description).join(', ');
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 175).length > 0) {
        this.saveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 176).length > 0) {
        this.approveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 1177).length > 0) {
        this.printButton = true;
      }
    }
    // console.log(this.approveButton);

    this.invoiceHdForm = this.fb.group({
      autoId: [0],
      invoiceNo: ['', [Validators.required, Validators.maxLength(30)]],
      customerId: ['', [Validators.required]],
      taxNo: [{ value: '', disabled: true }],
      vatNo: [{ value: '', disabled: true }],
      customerAddId: ['', Validators.required],
      invCurrencyId: [0],
      baseCurrencyId: [0],
      invCurrency: [{ value: '', disabled: true }],
      exchangeRate: [''],
      attention: [''],
      transDate: [{ value: date, disabled: true }],
    });

    this.invoiceDtForm = this.fb.group({
      dispatchDtId: [0],
      dispatchNo: [{ value: '', disabled: true }],
      salesOrderNo: [{ value: '', disabled: true }],
      soItemId: [0],
      articleId: [0],
      article: [{ value: '', disabled: true }],
      colorId: [0],
      color: [{ value: '', disabled: true }],
      sizeId: [0],
      size: [{ value: '', disabled: true }],
      qty: [0, Validators.required],
      balQty: [0],
      uomId: [0],
      uom: [{ value: '', disabled: true }],
      price: [{ value: 0, disabled: true }],
      value: [{ value: 0, disabled: true }],
      taxCode: ['', Validators.required],
      taxRate: [{ value: 0, disabled: true }, Validators.required],
      lineTax: [{ value: 0, disabled: true }],
      grossAmount: [{ value: 0, disabled: true }],
      discount: [0, Validators.required],
      disAmount: [0, Validators.required],
      // netTotal: [{ value: 0, disabled: true }],
    });
  }

  ///// LOAD COMPANY DEFAULT CURRENCY
  loadDefaultCurrency() {
    // console.log(this.user);
    this.masterServices.getCompany(this.user.moduleId).subscribe((result) => {
      this.defCurrency = result[0]['defaultCurrency'];
      this.invoiceHdForm
        .get('baseCurrencyId')
        .setValue(result[0]['defCurrencyId']);
    });
  }

  ///// GET INVOICE NO
  getInvoiceNo() {
    this.invoiceHdForm.get('invoiceNo').setValue('');
    this.salesOrderServices.getRefNumber('InvoiceNo').subscribe((result) => {
      this.invoiceHdForm.get('invoiceNo').setValue(result.refNo.toString());
    });
  }

  //// GET CUSTOMER LIST REALTED TO THE LOGGING LOACTION
  loadCustomer() {
    var locationId = this.user.locationId;
    this.masterServices.getCustomerHdAll(locationId).subscribe((result) => {
      this.custometList = result;
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

  /// DISPATCH NO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode != 13) {
      var date: Date = new Date(Date.now());
      this.clearCustomerDetails();
      this.invoiceHdForm.get('autoId').setValue(0);
      this.invoiceHdForm.get('customerId').setValue('');
      this.invoiceHdForm.get('customerId').enable();
      this.invoiceHdForm.get('exchangeRate').setValue('');
      this.invoiceHdForm.get('transDate').setValue(date);

      this.invoiceDtList = [];
      this.totalAmount = 0;
      this.taxAmount = 0;
      this.discount = 0;
      this.grossAmount = 0;
      this.nbt = 0;
      this.nbtPr = 0;
      this.netAmount = 0;
      this.totNetValue = 0;
      this.totTaxValue = 0;
      this.invoiceStatus = '';
      this.isDisplayMode = false;

      this.invoiceDtForm.get('dispatchDtId').setValue(0);
      this.invoiceDtForm.get('salesOrderNo').setValue('');
      this.invoiceDtForm.get('soItemId').setValue(0);
      this.invoiceDtForm.get('articleId').setValue(0);
      this.invoiceDtForm.get('article').setValue('');
      this.invoiceDtForm.get('color').setValue('');
      this.invoiceDtForm.get('size').setValue('');
      this.invoiceDtForm.get('soItemId').setValue(0);
      this.invoiceDtForm.get('colorId').setValue(0);
      this.invoiceDtForm.get('sizeId').setValue(0);
      this.invoiceDtForm.get('qty').setValue(0);
      this.invoiceDtForm.get('uomId').setValue(0);
      this.invoiceDtForm.get('uom').setValue('');
      this.invoiceDtForm.get('price').setValue(0);
      this.invoiceDtForm.get('value').setValue(0);
      this.invoiceDtForm.get('taxCode').setValue('');
      this.invoiceDtForm.get('taxRate').setValue(0);
      this.invoiceDtForm.get('lineTax').setValue(0);
      this.invoiceDtForm.get('grossAmount').setValue(0);
      this.invoiceDtForm.get('discount').setValue(0);
      this.invoiceDtForm.get('disAmount').setValue(0);
    } else {
      this.loadInvoice();
    }
  }

  /// ON CUSTOMER SELECT LOAD BILLING ADDRESS LIST , VAT TAX DETAILS AND ATTENTION
  onCustomerSelect(event) {
    this.clearCustomerDetails();

    let date: Date = new Date();

    for (const item of event.added) {
      // console.log(this.custometList);
      var filterCus = this.custometList.filter((x) => x.autoId == item);

      var cusCurrency = filterCus[0]['currencyCode'];
      this.invoiceHdForm.get('vatNo').setValue(filterCus[0]['vatNo']);
      this.invoiceHdForm.get('taxNo').setValue(filterCus[0]['taxNo']);
      this.invoiceHdForm.get('attention').setValue(filterCus[0]['attention']);
      this.invoiceHdForm
        .get('invCurrencyId')
        .setValue(filterCus[0]['currencyId']);
      this.invoiceHdForm
        .get('invCurrency')
        .setValue(filterCus[0]['currencyCode']);
      date.setDate(date.getDate() + filterCus[0]['creditDays']);
      this.paymentDue = this.datePipe.transform(date, 'yyyy-MM-dd');
      //console.log(this.paymentDue);
      this.loadsBillingAddress(item);
      this.loadsInvoicePendDetails(item);

      ///// CHECK COMPANY CURRENCY AND CUSTOMER CURRENCY
      ///// IF BOTH SAME EXCHANGE RATE IS 1 ELSE GET FROM EXCHANGE TABLE
      if (this.defCurrency == cusCurrency) {
        this.exchRate = 1;
      } else {
        this.financeService.getExchangeRate().subscribe((result) => {
          var rateLine = result.filter(
            (x) =>
              x.currencyFrom == cusCurrency && x.currencyTo == this.defCurrency
          );
          this.exchRate = rateLine[0]['rate'];
        });
      }
    }
  }

  //// CLEAR DETAILS WHEN CUSTOMER SELECT
  clearCustomerDetails() {
    this.pendInvoiceList = [];
    this.addressList = [];
    this.invoiceHdForm.get('vatNo').setValue('');
    this.invoiceHdForm.get('taxNo').setValue('');
    this.invoiceHdForm.get('attention').setValue('');
    this.invoiceHdForm.get('invCurrencyId').setValue(0);
    this.invoiceHdForm.get('invCurrency').setValue('');
    this.invoiceHdForm.get('customerAddId').setValue('');
    this.paymentDue = '';
    this.exchRate = 0;
  }

  /// ON SELECT TAX CODE
  onTaxCodeChange(event) {
    for (const item of event.added) {
      this.calculateLineAmount(item);
    }
  }

  calculateLineAmount(item) {
    var taxLine = this.taxList.filter((x) => x.autoId == item);

    var taxRate = taxLine[0]['rate'];
    var value = this.invoiceDtForm.get('value').value;
    var lineTax = this.roundTo((taxRate * value) / 100, 2);
    var grossAmount = lineTax + lineTax;

    this.invoiceDtForm.get('taxRate').setValue(taxRate);
    this.invoiceDtForm.get('lineTax').setValue(lineTax);
    this.invoiceDtForm.get('grossAmount').setValue(grossAmount);
  }

  loadTax() {
    this.financeService.getTax().subscribe((result) => {
      this.taxList = result;
      // console.log(this.taxList);
    });
  }

  loadsBillingAddress(customerId) {
    var billAddList = [];
    this.masterServices
      .getCustomerAddressList(customerId)
      .subscribe((result) => {
        for (let a = 0; a < result.length; a++) {
          const element = result[a];
          if (element['addressCodeName'].indexOf('Bill') != -1) {
            billAddList.push(element);
          }
        }
        // console.log(billAddList);
        this.addressList = billAddList;
      });
  }

  loadsInvoicePendDetails(customerId) {
    this.financeService.getInvoicePendingDt(customerId).subscribe((result) => {
      this.pendInvoiceList = result;
    });
  }

  /// LOD SELECTED LINE TO FORM
  onPendInvoiceDown(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.pendInvoiceGrid.data.filter((record) => {
      return record.dispatchDtId == ids;
    });

    this.invoiceDtForm
      .get('dispatchDtId')
      .setValue(selectedRowData[0]['dispatchDtId']);
    this.invoiceDtForm
      .get('dispatchNo')
      .setValue(selectedRowData[0]['dispatchNo']);
    this.invoiceDtForm
      .get('salesOrderNo')
      .setValue(selectedRowData[0]['orderRef']);
    this.invoiceDtForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.invoiceDtForm
      .get('articleId')
      .setValue(selectedRowData[0]['articleId']);
    this.invoiceDtForm
      .get('article')
      .setValue(selectedRowData[0]['articleName']);
    this.invoiceDtForm.get('colorId').setValue(selectedRowData[0]['colorId']);
    this.invoiceDtForm.get('color').setValue(selectedRowData[0]['color']);
    this.invoiceDtForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
    this.invoiceDtForm.get('size').setValue(selectedRowData[0]['size']);
    this.invoiceDtForm.get('qty').setValue(selectedRowData[0]['balQty']);
    this.invoiceDtForm.get('balQty').setValue(selectedRowData[0]['balQty']);
    this.invoiceDtForm
      .get('uomId')
      .setValue(selectedRowData[0]['measurementId']);
    this.invoiceDtForm.get('uom').setValue(selectedRowData[0]['uom']);
    this.invoiceDtForm.get('price').setValue(selectedRowData[0]['price']);
    this.invoiceDtForm.get('value').setValue(selectedRowData[0]['value']);
  }

  /// DELETE INVOICE DETAILS
  onDialogOKSelected(event) {
    event.dialog.close();
    // console.log(this.rowId);

    if (this.rowId > 0) {
      /// ADJUST THE PENDING INVOICE STATUS
      this.pendInvoiceGrid.updateCell(false, this.rowId, 'status');
      //// DELETE INVOICE ITEM
      this.invoiceDtGrid.deleteRow(this.rowId);
      this.calculateSummarry();
    }
  }

  ///// IF USER SECLECT CONFIRM TO DELETE 
  onDialogConfirmSelected(event) {
    event.dialog.close();    
    this.approveInvoice();   
  }

  /// DELETE CONFIRMATION OF INVOICE DETAILS
  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;
    // console.log(cellId);
    this.dialog.open();
  }

  //// OPEN INVOICE CONFIRMATION DIALOG
  openInvConfirmDialog() {
    this.confDialog.open();
  }
 
  /// QTY LOST FOCUS
  onFocusOutEvent(event) {
    this.calculateInvLineValue();

    var taxCodeId = this.invoiceDtForm.get('taxCode').value[0];
    if (taxCodeId > 0) this.calculateLineAmount(taxCodeId);
  }

  /// QTY KEY UP EVENT PRESSED
  onQtyKey(event) {
    if (event.keyCode != 13) {
      this.calculateInvLineValue();
      var taxCodeId = this.invoiceDtForm.get('taxCode').value[0];
      if (taxCodeId > 0) this.calculateLineAmount(taxCodeId);
    }
  }

  calculateInvLineValue() {
    var qty = this.invoiceDtForm.get('qty').value;
    var price = this.invoiceDtForm.get('price').value;

    var value = this.roundTo(qty * price, 2);
    // console.log(value);
    this.invoiceDtForm.get('value').setValue(value);
  }

  addInvoiceDetails() {
    if (this.validateQty()) {
      var dispatchDtId = this.invoiceDtForm.get('dispatchDtId').value;

      var selectRowData = this.invoiceDtGrid.data.filter((record) => {
        return record.dispatchDtId == dispatchDtId;
      });

      var qty = this.invoiceDtForm.get('qty').value;
      var value = this.invoiceDtForm.get('value').value;
      var taxCodeId = this.invoiceDtForm.get('taxCode').value[0];
      var taxCode = this.taxCode.value;
      var taxRate = this.invoiceDtForm.get('taxRate').value;
      var lineTax = this.invoiceDtForm.get('lineTax').value;
      var grossAmount = this.invoiceDtForm.get('grossAmount').value;
      var discount = this.invoiceDtForm.get('discount').value;
      var disAmount = this.invoiceDtForm.get('disAmount').value;

      if (discount > 0) {
        disAmount = (discount / 100) * grossAmount;
      }
      var netTotal = grossAmount - disAmount;

      //// CHECK INVOICE LINE ADDED OR NOT
      if (selectRowData.length > 0) {
        this.invoiceDtGrid.updateCell(qty, dispatchDtId, 'qty');
        this.invoiceDtGrid.updateCell(value, dispatchDtId, 'value');
        this.invoiceDtGrid.updateCell(taxCodeId, dispatchDtId, 'taxCodeId');
        this.invoiceDtGrid.updateCell(taxCode, dispatchDtId, 'taxCode');
        this.invoiceDtGrid.updateCell(taxRate, dispatchDtId, 'taxRate');
        this.invoiceDtGrid.updateCell(lineTax, dispatchDtId, 'lineTax');
        this.invoiceDtGrid.updateCell(grossAmount, dispatchDtId, 'grossAmount');
        this.invoiceDtGrid.updateCell(discount, dispatchDtId, 'discount');
        this.invoiceDtGrid.updateCell(disAmount, dispatchDtId, 'disAmount');
        this.invoiceDtGrid.updateCell(netTotal, dispatchDtId, 'netTotal');
      } else {
        this.pendInvoiceGrid.updateCell(true, dispatchDtId, 'status');
        var obj = {
          dispatchDtId: dispatchDtId,
          dispatchNo: this.invoiceDtForm.get('dispatchNo').value,
          orderRef: this.invoiceDtForm.get('salesOrderNo').value,
          soItemId: this.invoiceDtForm.get('soItemId').value,
          articleId: this.invoiceDtForm.get('articleId').value,
          articleName: this.invoiceDtForm.get('article').value,
          colorId: this.invoiceDtForm.get('colorId').value,
          color: this.invoiceDtForm.get('color').value,
          sizeId: this.invoiceDtForm.get('sizeId').value,
          size: this.invoiceDtForm.get('size').value,
          qty: qty,
          balQty: this.invoiceDtForm.get('balQty').value,
          uomId: this.invoiceDtForm.get('uomId').value,
          uom: this.invoiceDtForm.get('uom').value,
          price: this.invoiceDtForm.get('price').value,
          value: value,
          taxCodeId: taxCodeId,
          taxCode: taxCode,
          taxRate: taxRate,
          lineTax: lineTax,
          grossAmount: grossAmount,
          discount: discount,
          disAmount: disAmount,
          netTotal: netTotal,
        };
        // console.log(obj);
        this.invoiceDtGrid.addRow(obj);
      }
      this.clearInvoiceDetails();
      this.calculateSummarry();
    }
  }

  validateQty() {
    var qty = this.invoiceDtForm.get('qty').value;
    var balQty = this.invoiceDtForm.get('balQty').value;
    // console.log(balQty);
    // console.log(qty);

    if (balQty < qty) {
      this.toastr.warning('Qty can not be more tahn Bal Qty');
      return false;
    } else return true;
  }

  calculateSummarry() {
    var rowData = this.invoiceDtGrid.data;
    var _totAmount = 0,
      _lineTax = 0,
      _grossAmount = 0,
      _disAmount = 0,
      _nbtPr = 0;

    var taxLine = this.taxList.filter((x) => x.description == 'NBT');
    _nbtPr = taxLine[0]['rate'];

    // console.log(taxLine);
    // console.log(rowData);
    if (rowData.length > 0) {
      for (let a = 0; a < rowData.length; a++) {
        _totAmount = _totAmount + rowData[a]['value'];
        _lineTax = _lineTax + rowData[a]['lineTax'];
        _grossAmount = _grossAmount + rowData[a]['grossAmount'];
        _disAmount = _disAmount + rowData[a]['disAmount'];
      }
    }

    this.totalAmount = _totAmount;
    this.taxAmount = _lineTax;
    this.grossAmount = _grossAmount;
    this.discount = _disAmount;
    this.nbtPr = _nbtPr;
    this.nbt = (_totAmount * _nbtPr) / 100;
    this.netAmount = this.roundTo((_grossAmount - (_disAmount + this.nbt)) , 2);
    this.totNetValue = this.netAmount * this.exchRate;
    this.totTaxValue = this.roundTo((_lineTax * this.exchRate) ,2);
  }

  clearInvoiceDetails() {
    this.invoiceDtForm.get('dispatchDtId').setValue(0);
    this.invoiceDtForm.get('dispatchNo').setValue('');
    this.invoiceDtForm.get('salesOrderNo').setValue('');
    this.invoiceDtForm.get('soItemId').setValue(0);
    this.invoiceDtForm.get('articleId').setValue(0);
    this.invoiceDtForm.get('article').setValue('');
    this.invoiceDtForm.get('color').setValue('');
    this.invoiceDtForm.get('size').setValue('');
    this.invoiceDtForm.get('soItemId').setValue(0);
    this.invoiceDtForm.get('colorId').setValue(0);
    this.invoiceDtForm.get('sizeId').setValue(0);
    this.invoiceDtForm.get('qty').setValue(0);
    this.invoiceDtForm.get('uomId').setValue(0);
    this.invoiceDtForm.get('uom').setValue('');
    this.invoiceDtForm.get('price').setValue(0);
    this.invoiceDtForm.get('value').setValue(0);
    this.invoiceDtForm.get('taxCode').setValue('');
    this.invoiceDtForm.get('taxRate').setValue(0);
    this.invoiceDtForm.get('lineTax').setValue(0);
    this.invoiceDtForm.get('grossAmount').setValue(0);
    this.invoiceDtForm.get('discount').setValue(0);
    this.invoiceDtForm.get('disAmount').setValue(0);
  }

  onInvoiceEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.invoiceDtGrid.data.filter((record) => {
      return record.dispatchDtId == ids;
    });

    this.invoiceDtForm
      .get('dispatchDtId')
      .setValue(selectedRowData[0]['dispatchDtId']);
    this.invoiceDtForm
      .get('dispatchNo')
      .setValue(selectedRowData[0]['dispatchNo']);
    this.invoiceDtForm
      .get('salesOrderNo')
      .setValue(selectedRowData[0]['orderRef']);
    this.invoiceDtForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.invoiceDtForm
      .get('articleId')
      .setValue(selectedRowData[0]['articleId']);
    this.invoiceDtForm
      .get('article')
      .setValue(selectedRowData[0]['articleName']);
    this.invoiceDtForm.get('colorId').setValue(selectedRowData[0]['colorId']);
    this.invoiceDtForm.get('color').setValue(selectedRowData[0]['color']);
    this.invoiceDtForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
    this.invoiceDtForm.get('size').setValue(selectedRowData[0]['size']);
    this.invoiceDtForm.get('qty').setValue(selectedRowData[0]['qty']);
    this.invoiceDtForm.get('balQty').setValue(selectedRowData[0]['balQty']);
    this.invoiceDtForm
      .get('uomId')
      .setValue(selectedRowData[0]['measurementId']);
    this.invoiceDtForm.get('uom').setValue(selectedRowData[0]['uom']);
    this.invoiceDtForm.get('price').setValue(selectedRowData[0]['price']);
    this.invoiceDtForm.get('value').setValue(selectedRowData[0]['value']);
    this.taxCode.setSelectedItem(selectedRowData[0]['taxCodeId'], true);
    this.invoiceDtForm.get('lineTax').setValue(selectedRowData[0]['lineTax']);
    this.invoiceDtForm.get('taxRate').setValue(selectedRowData[0]['taxRate']);
    this.invoiceDtForm
      .get('grossAmount')
      .setValue(selectedRowData[0]['grossAmount']);
    this.invoiceDtForm.get('discount').setValue(selectedRowData[0]['discount']);
    this.invoiceDtForm
      .get('disAmount')
      .setValue(selectedRowData[0]['disAmount']);
  }

  //// SAVE INVOICE
  saveInvoice() {
    if (this.saveButton == true) {
      if(this.validateInvoice()) {
      var customerId = this.invoiceHdForm.get('customerId').value[0];
      var invoiceHd = {
        autoId: this.invoiceHdForm.get('autoId').value,
        invoiceNo: this.invoiceHdForm.get('invoiceNo').value.trim(),
        customerId: this.invoiceHdForm.get('customerId').value[0],
        vatNo: this.invoiceHdForm.get('vatNo').value,
        taxNo: this.invoiceHdForm.get('taxNo').value,
        customerAddId: this.invoiceHdForm.get('customerAddId').value[0],
        invCurrencyId: this.invoiceHdForm.get('invCurrencyId').value,
        baseCurrencyId: this.invoiceHdForm.get('baseCurrencyId').value,
        exchangeRate: this.exchRate,
        attention: this.invoiceHdForm.get('attention').value,
        totalAmount: this.totalAmount,
        taxAmount: this.taxAmount,
        grossAmount: this.grossAmount,
        discountAmount: this.discount,
        nBTRate: this.nbtPr,
        nBTAmount: this.nbt,
        netAmount: this.netAmount,
        netValue: this.totNetValue,
        taxValue: this.totTaxValue,
        paymentDueDate: this.paymentDue,
        locationId: this.user.locationId,
        createUserId: this.user.userId,
      };

      ////--------=========== INVOICE DETAILS =======================---------
      var itemRows = this.invoiceDtGrid.data;
      var invoiceDt = [];
      // console.log(this.invoiceDtGrid.data);

      itemRows.forEach((items) => {
        var itemdata = {
          dispatchDtId: items.dispatchDtId,
          soItemDtId: items.soItemId,
          qty: items.qty,
          uom: items.uomId,
          unitPrice: items.price,
          value: items.value,
          taxId: items.taxCodeId,
          taxRate: items.taxRate,
          taxAmount: items.lineTax,
          grossAmount: items.grossAmount,
          discountP: items.discount,
          discountA: items.disAmount,
          netAmount: items.netTotal,
        };
        invoiceDt.push(itemdata);
      });

      var invoiceList = {
        invoiceHeader: invoiceHd,
        invoiceDetails: invoiceDt,
      };

      // console.log(invoiceList);
      this.financeService.saveInvoice(invoiceList).subscribe((result) => {
        if (result['result'] == 1) {
          this.toastr.success('Invoice save Successfully !!!');
          this.invoiceHdForm.get('autoId').setValue(result['refNumId']);
          this.invoiceHdForm.get('invoiceNo').setValue(result['refNum']);
          this.loadInvoice();
          this.loadsInvoicePendDetails(customerId);
        } else if (result['result'] == 2) {
          this.toastr.success('Invoice update Successfully !!!');
          this.invoiceHdForm.get('autoId').setValue(result['refNumId']);
          this.invoiceHdForm.get('invoiceNo').setValue(result['refNum']);
          this.loadInvoice();
          this.loadsInvoicePendDetails(customerId);
        } else {
          this.toastr.warning(
            'Contact Admin. Error No:- ' + result['result'].toString()
          );
        }
      });
    } 
  } else {
    this.toastr.warning('Save permission denied !!!');
  }
}

  validateInvoice() {
    if (this.invoiceDtGrid.dataLength > 0) {
      return true;
    } else {
      this.toastr.info('Invoice Details are required !!!');
      return false;
    }
  }

  //// APPROVE INVOICE
  approveInvoice() {
    if (this.approveButton == true) {
      var obj = {
        autoId: this.invoiceHdForm.get('autoId').value,
        createUserId: this.user.userId,
      };

      this.financeService.approveInvoice(obj).subscribe((result) => {
        // console.log(result);
        if (result == 1) {
          this.toastr.success('Invoice approve Successfully !!!');
          this.loadInvoice();
        } else {
          this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.warning('Approve permission denied !!!');
    }
  }

  /// LOADS EXISTING INVOICE DETAILS
  loadInvoice() {
    this.clearCustomerDetails();
    this.clearInvoiceDetails();
    this.invoiceHdForm.get('customerId').enable();

    var invoiceDt = [];
    this.isDisplayMode = true;
    var invoiceNo = this.invoiceHdForm.get('invoiceNo').value.trim();

    this.financeService.getInvoiceDetails(invoiceNo).subscribe(
      (result) => {
        // console.log(result);
        //////---------====== LOADS INVOICE HEADER ================---------
        if (result.invoiceHeader != null) {
          var invoiceHdRow = result.invoiceHeader;

          var trnsDate: Date = new Date(
            this.datePipe.transform(invoiceHdRow[0]['transDate'], 'yyyy-MM-dd')
          );
          var payDueDate: Date = new Date(
            this.datePipe.transform(
              invoiceHdRow[0]['paymentDueDate'],
              'yyyy-MM-dd'
            )
          );

          this.invoiceHdForm.get('transDate').setValue(trnsDate);
          this.customer.setSelectedItem(invoiceHdRow[0]['customerId'], true);
          this.loadsBillingAddress(invoiceHdRow[0]['customerId']);
          this.invoiceHdForm.get('autoId').setValue(invoiceHdRow[0]['autoId']);
          this.invoiceHdForm.get('taxNo').setValue(invoiceHdRow[0]['taxNo']);
          this.invoiceHdForm.get('vatNo').setValue(invoiceHdRow[0]['vatNo']);
          this.invoiceHdForm
            .get('attention')
            .setValue(invoiceHdRow[0]['attention']);
          this.invoiceHdForm
            .get('invCurrencyId')
            .setValue(invoiceHdRow[0]['invCurrencyId']);
          this.invoiceHdForm
            .get('invCurrency')
            .setValue(invoiceHdRow[0]['invCurrency']);
          this.invoiceHdForm
            .get('baseCurrencyId')
            .setValue(invoiceHdRow[0]['baseCurrencyId']);
          this.defCurrency = invoiceHdRow[0]['baseCurrency'];
          this.billAddressId = invoiceHdRow[0]['customerAddId'];

          this.isApproved = invoiceHdRow[0]['isApproved'];
          this.totalAmount = invoiceHdRow[0]['totalAmount'];
          this.taxAmount = invoiceHdRow[0]['taxAmount'];
          this.exchRate = invoiceHdRow[0]['exchangeRate'];
          this.paymentDue = this.datePipe.transform(payDueDate, 'yyyy-MM-dd');
          this.netAmount = invoiceHdRow[0]['netAmount'];
          this.grossAmount = invoiceHdRow[0]['grossAmount'];
          this.discount = invoiceHdRow[0]['discountAmount'];
          this.nbtPr = invoiceHdRow[0]['nbtRate'];
          this.nbt = invoiceHdRow[0]['nbtAmount'];
          this.totNetValue = invoiceHdRow[0]['netValue'];
          this.totTaxValue = invoiceHdRow[0]['taxValue'];

          if (this.isApproved == false) this.invoiceStatus = 'Active Invoice';
          else if (this.isApproved == true)
            this.invoiceStatus = 'Approved Invoice';

          this.loadsInvoicePendDetails(invoiceHdRow[0]['customerId']);
        }
        ///// ----------=============== LOADS INVOICE DETAILS ==============-------
        if (result.invoiceDetails != null) {
          var invoiceDetails = result.invoiceDetails;

          for (let a = 0; a < invoiceDetails.length; a++) {
            var taxLine = this.taxList.filter(
              (x) => x.autoId == invoiceDetails[a]['taxId']
            );

            var obj = {
              dispatchDtId: invoiceDetails[a]['dispatchDtId'],
              dispatchNo: invoiceDetails[a]['dispatchNo'],
              orderRef: invoiceDetails[a]['orderRef'],
              soItemId: invoiceDetails[a]['soItemId'],
              articleId: invoiceDetails[a]['articleId'],
              articleName: invoiceDetails[a]['articleName'],
              colorId: invoiceDetails[a]['colorId'],
              color: invoiceDetails[a]['color'],
              sizeId: invoiceDetails[a]['sizeId'],
              size: invoiceDetails[a]['size'],
              balQty: invoiceDetails[a]['balQty'],
              qty: invoiceDetails[a]['qty'],
              uomId: invoiceDetails[a]['measurementId'],
              uom: invoiceDetails[a]['uom'],
              price: invoiceDetails[a]['unitPrice'],
              value: invoiceDetails[a]['value'],
              taxCodeId: invoiceDetails[a]['taxId'],
              taxCode: taxLine[0]['description'],
              taxRate: invoiceDetails[a]['taxRate'],
              lineTax: invoiceDetails[a]['taxAmount'],
              grossAmount: invoiceDetails[a]['grossAmount'],
              discount: invoiceDetails[a]['discountP'],
              disAmount: invoiceDetails[a]['discountA'],
              netTotal: invoiceDetails[a]['netAmount'],
            };

            invoiceDt.push(obj);
          }
          this.invoiceDtList = invoiceDt;
        }
      },
      (err) => console.error(err),
      () => {
        this.setComboValues();
      }
    );
  }

  setComboValues() {
    setTimeout(() => {
      this.billAddress.setSelectedItem(this.billAddressId, true);
      this.invoiceHdForm.get('customerId').disable();
    }, 1000);
  }

  //// round the any value
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    // console.log(factor);
    return Math.round(num * factor) / factor;
  }

  refreshControls() {
    var date: Date = new Date(Date.now());
    this.clearCustomerDetails();
    this.invoiceHdForm.get('autoId').setValue(0);
    this.invoiceHdForm.get('customerId').setValue('');
    this.invoiceHdForm.get('customerId').enable();
    this.invoiceHdForm.get('exchangeRate').setValue('');
    this.invoiceHdForm.get('transDate').setValue(date);

    this.invoiceDtList = [];
    this.totalAmount = 0;
    this.taxAmount = 0;
    this.discount = 0;
    this.grossAmount = 0;
    this.nbt = 0;
    this.nbtPr = 0;
    this.netAmount = 0;
    this.totNetValue = 0;
    this.totTaxValue = 0;
    this.invoiceStatus = '';
    this.isDisplayMode = false;
    this.clearInvoiceDetails();
    this.getInvoiceNo();
  }

  printInvoice() {
    if(this.printButton == true) {
      // this.router.navigate(['/boldreport']);
      var obj = {
        invoiceHdId: this.invoiceHdForm.get('autoId').value,
        reportName: "InvoiceFormat"
      }
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }

  /// set tax rate
  // editExit(event) {
  //   var disAmount = 0;
  //   var row = event.cellID;
  //   var dispatchDtId = row.rowID;
  //   var rowData = event.rowData
  //   var taxLine = rowData.taxCode;

  //   /// ACCESS TAX ARRAY AND GET RATE VALUE
  //   var taxrate = taxLine[0]["rate"];
  //   var lineTax = taxrate * rowData["value"];
  //   var grossAmount = lineTax + rowData["value"];

  //   this.invoiceDtGrid.updateCell(taxrate, dispatchDtId, 'taxRate');
  //   this.invoiceDtGrid.updateCell(lineTax, dispatchDtId, 'lineTax');
  //   this.invoiceDtGrid.updateCell(grossAmount, dispatchDtId, 'grossAmount');

  //   if (rowData["discount"] > 0) {
  //     disAmount = (rowData["discount"] /100) * grossAmount ;
  //     this.invoiceDtGrid.updateCell(disAmount, dispatchDtId, 'disAmount');
  //   } else {
  //     disAmount = rowData["disAmount"] ;
  //   }

  //   var netTotal = grossAmount - disAmount ;
  //   this.invoiceDtGrid.updateCell(netTotal, dispatchDtId, 'netTotal');

  // }
}
