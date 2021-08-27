using System;

namespace API.DTOs
{
    public class DispatchedDetDto
    {
        public int AutoId {get;set;} 
        public string DispatchNo {get;set;}
        public int CustomerId {get;set;}
        public int CusLocationId {get;set;}
        public DateTime TransDate {get;set;}
        public int DispatchSiteId {get;set;}
        public string Reason {get;set;}
        public int LocationId {get;set;}
        public long SOItemId {get;set;}
        public long SODelivDtId {get;set;}
        public bool IsActive {get;set;}
        public string DeliveryRef {get;set;}
        public string OrderRef {get;set;}
        public string ArticleName {get;set;}
        public string Color {get;set;}
        public string Size {get;set;}
        public int ProducedQty {get;set;}
        public int DispatchedQty {get;set;}
        public int BalDispatchQty {get;set;}
       
    }
}