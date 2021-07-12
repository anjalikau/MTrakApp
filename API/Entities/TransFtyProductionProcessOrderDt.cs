using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
     [Table("Trans.FtyProductionProcessOrderDt")]
    public class TransFtyProductionProcessOrderDt
    {
        [Key]
        public long AutoId {get;set;}
        public long FPPOId {get;set;}
        public long SODelivDtId {get;set;}
        public byte TypeId {get;set;}
        public int ReqQty {get;set;}
        public int SiteId {get;set;}
        public int Qty {get;set;}
        public bool bActive {get;set;}
        public int ? CreateUserId {get;set;}
        public DateTime ? CreateDateTime {get;set;}
        public int ? UpdateUserId {get;set;}
        public DateTime ? UpdateDateTime {get;set;}
        public virtual TransFtyProductionProcessOrder TransFtyProdProcessOrder {get; set;}
        public virtual TransSalesOrderDeliveryDt TransSalesOrderDeliveryDt {get; set;}
    }
}