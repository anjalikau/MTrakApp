using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.InvoiceDetails")]
    public class TransInvoiceDetails
    {
        [Key]
        public long AutoId {get;set;}
        public long InvoiceHdId {get;set;}
        public long DispatchDtId {get;set;}
        public long SOItemDtId {get;set;}
        public string Description {get;set;}
        public int Qty {get;set;}
        public int UOM {get;set;}
        public decimal UnitPrice {get;set;}
        public decimal Value {get;set;}
        public int TaxId {get;set;}
        public decimal TaxRate {get;set;}
        public decimal TaxAmount {get;set;}
        public decimal GrossAmount {get;set;}
        public decimal DiscountP {get;set;}
        public decimal DiscountA {get;set;}
        public decimal NetAmount {get;set;}
        public int ? CreateUserId {get;set;}
        public DateTime ? CreateDateTime {get;set;}
        public int ? UpdateUserId {get;set;}
        public DateTime ? UpdateDateTime {get;set;}
        public TransInvoiceHeader InvoiceHeader { get; set; }
    }
}