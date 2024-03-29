import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApproveCenter } from 'src/app/_models/ApproveCenter';
import { DispatchNoteDt } from 'src/app/_models/DispatchNoteDt';
import { DispatchProdDt } from 'src/app/_models/dispatchProdDt';
import { FPPOProdDetails } from 'src/app/_models/FPPOProdDetails';
import { SalesOrder } from 'src/app/_models/salesOrder';
import { TransProdDetails } from 'src/app/_models/transProdDetails';
import { environment } from 'src/environments/environment';

var usertoken: any;
//console.log(localStorage);
if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getSalesOrderRef() {
    return this.http.get<SalesOrder>(this.baseUrl + 'SalesOrder/SORefNo' , httpOptions);
  }

  getSalesOrderDT(OrderRef: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SO/' + OrderRef , httpOptions);
  }

  getPendCostSalesOrders(customerId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/PendSO/' + customerId , httpOptions);
  }

  getPendSalesHeader(soHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOHead/' + soHeaderId , httpOptions);
  }

  saveSalesOrder(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaSO' , model , httpOptions);
  }

  getSalesOrderList(cusRef: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOList/' + cusRef , httpOptions);  
  }

  getCostSalesOrderList(costingId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CSOList/' + costingId , httpOptions);  
  }

  getPendOrderItems(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JobPedItems/' + id , httpOptions)
  }

  getPendDelivOrder(model: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/JobPedOrders' , model , httpOptions);
  }

  getRefNumber(transType: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/RefNum/' + transType , httpOptions);
  }

  getCostComination(model: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/CostComb' , model , httpOptions);
  }

  saveJobCard(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveJob' , model , httpOptions);
  }

  getJobCardDetails(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JobCard/' + id , httpOptions);
  }

  getJobCardList(customerPO: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JCList/' + customerPO , httpOptions);
  }

  getFPOPendingJobs() {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPO/JobList' , httpOptions);
  }

  getFPONoList(cusRef: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/FPOList/' + cusRef , httpOptions);
  }

  getFPOPendingJobDt(jobId: number) {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPO/JobList/' + jobId , httpOptions);
  }

  saveFPO(fpoList: any[]) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPO' , fpoList , httpOptions);
  }

  getFPODetails(fpoNo: string) {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPODetails/' + fpoNo , httpOptions);
  }

  deleteFPO(fpodt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/DeleteFPO' , fpodt , httpOptions);
  }

  getFPPOInDetails(fPPODId: number) {
    return this.http.get<FPPOProdDetails>(this.baseUrl + 'SalesOrder/FPPOIn/' + fPPODId ,httpOptions );
  }

  saveFPPOInDetails(fppoIn: TransProdDetails) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPOIn' , fppoIn , httpOptions);
  }

  getTransProductionTot() {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPPOTot/' ,httpOptions );
  }

  getFPPOOutDetails(fPPODId: number) {
    return this.http.get<FPPOProdDetails>(this.baseUrl + 'SalesOrder/FPPOOut/' + fPPODId ,httpOptions );
  }

  saveFPPOOutDetails(fppoOut: TransProdDetails){
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPOOut' , fppoOut , httpOptions);
  }

  saveFPPORejectDetails(transDamg: any[]){
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPORej' , transDamg , httpOptions);
  }

  getDispatchSite() {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/DispatchSite' , httpOptions );
  }

  getDispatchNoList(cusRef: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/DispList/' + cusRef , httpOptions );
  }

  getPendDispatchDetails(prod: any){
    return this.http.post<DispatchProdDt[]>(this.baseUrl + 'SalesOrder/PendDispatch' , prod , httpOptions);
  }

  saveDispatchDetails(diaptch: any[]){
    return this.http.post(this.baseUrl + 'SalesOrder/SaveDispatch' , diaptch , httpOptions);
  }

  getDispatchDetails(dispatchNo: number){
    return this.http.get<DispatchNoteDt[]>(this.baseUrl + 'SalesOrder/DD/' + dispatchNo , httpOptions);   
  }

  cancelDispatchDetails(diaptch: any){
    return this.http.post(this.baseUrl + 'SalesOrder/CancelDD' , diaptch , httpOptions);
  }

  saveCosting(costDt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveCost' , costDt , httpOptions );
  }

  getCostHeaderList(custId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CostList/' + custId , httpOptions);  
  }  

  getCostSheetDetails(costHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CSDt/' + costHeaderId , httpOptions );
  }

  getCostSheetHeader(costHeader: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/CostHd' , costHeader , httpOptions );
  }

  attachCostSheet(soItem: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/AttachCS' , soItem , httpOptions );
  }

  removeCostSheet(soItem: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/RemoveCS' , soItem , httpOptions );
  }

  getApproveRouteDetails(appRouteDt: any) {
    return this.http.post<any[]>(this.baseUrl + 'SalesOrder/AppRouteDt' , appRouteDt , httpOptions );
  }

  saveApproveCenterDt(approveCenter: ApproveCenter) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveApprove' , approveCenter , httpOptions );
  }

  getApproveCenterDt(userId: any) {
    return this.http.get<ApproveCenter[]>(this.baseUrl + 'SalesOrder/ACDt/' + userId , httpOptions );
  }

}
