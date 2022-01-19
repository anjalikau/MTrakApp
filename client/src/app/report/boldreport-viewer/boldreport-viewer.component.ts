import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-boldreport-viewer',
  templateUrl: './boldreport-viewer.component.html',
  styleUrls: ['./boldreport-viewer.component.css']
})
export class BoldreportViewerComponent implements OnInit {
  baseUrl = environment.apiUrl;
  title = 'reportviewerapp';
  public serviceUrl: string;
  public reportPath: string;
  public serverUrl: string;
  public processMode: string;
  public parameterSettings: any;
  public parameters: any;
  public isPrintMode: boolean;
  public printOption: any;
  public pageSettings: any;
  public reportFolder: any;
  paraObj: any;
  
  // @ViewChild('viewer') viewer: ElementRef
  
  constructor() {
    // this.serviceUrl = 'https://localhost:5001/api/ReportViewer';
    // this.reportPath = '~/Resources/sales-order-detail.rdl';
    this.serviceUrl = this.baseUrl + 'ReportViewer';
    this.serverUrl  = "http://192.168.1.211/ReportServer"; //http://10.0.2.5:8080/ReportServer  
    this.reportFolder =  "/CCSReport" 
    this.processMode = "Remote";
    this.isPrintMode = true;
    // this.pageSettings = { orientation: ej.ReportViewer.Orientation.Landscape }
    // this.printOption = ej.ReportViewer.PrintOptions.NewTab;
    this.parameterSettings =  { hideParameterBlock: true} ;  
    // console.log(this.router.getCurrentNavigation().extras.state);
   }

  ngOnInit(): void {
    this.getReportParameters();
    this.loadReports();
  }

  getReportParameters() {
    // this.paraObj = history.state;
    //// get parameters from local storage and assign to object
    this.paraObj = JSON.parse(localStorage.getItem('params'));
    /// remove local storage
    localStorage.removeItem('params');
  }

  loadReports() {
    var reportName = this.paraObj["reportName"];
    this.reportPath = this.reportFolder + "/" + reportName;

    if(reportName == "DispatchNoteFormat") { 
      /// set parameters
      this.parameters = [{
      name: 'DispatchNo',
      labels: ['Dispatch No'],
      values: [this.paraObj["dispatchNo"]],
      nullable: false     
      }]; 
    } else if (reportName == "JobDetailsFormat") {
      /// set parameters
      this.parameters = [{
      name: 'JobHeaderId',
      labels: ['JobHeader Id'],
      values: [this.paraObj["jobCardNo"]],
      nullable: false     
      }]; 
    } else if (reportName == "CostSheetFormat") {
      /// set parameters
      this.parameters = [{
      name: 'CostHeaderId',
      labels: ['Cost Header Id'],
      values: [this.paraObj["costingHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "CommercialInvoice") {
      // console.log(this.paraObj["invoiceHdId"]);
    //   this.pageSettings =  {
    //     orientation: this.viewer.ReportViewer.Orientation.Portrait,
    //     paperSize: ej.ReportViewer.PaperSize.A3,
    // };

      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "TaxInvoice") {
      // console.log(this.paraObj["invoiceHdId"]);
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "InternalInvoice") {
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    }
  }

}
