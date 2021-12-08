using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Article")]
    public class MstrArticle
    {
        [Key]
        public long AutoId {get;set;}
        public string StockCode {get;set;}
        public string ArticleName {get;set;}
        public string Description1 {get;set;}
        public string Description2 {get;set;}
        public int CategoryId {get;set;}
        public int ProTypeId {get;set;}
        public int ProGroupId {get;set;}
        public int ItemType {get;set;}
        public int StorageUnitId {get;set;}
        public int MeasurementId {get;set;}
        // public int GSM {get;set;}
        // public double ? BoardWidth {get;set;}
        // public double ? RollWidth {get;set;}
        public int ColorCardId {get;set;}
        public int SizeCardId {get;set;}
        public decimal SalesPrice {get;set;}
	    public bool IsActive {get;set;}
	    public decimal AvgCostPrice {get;set;}
	    public decimal LastCostPrice {get;set;}
	    public decimal MaxCostPrice {get;set;}
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; }
        public virtual MstrCategory MstrCategory { get; set; }
        public virtual MstrProductType MstrProductType { get; set; }
        public virtual MstrProductGroup MstrProductGroup { get; set; }
        public virtual MstrUnits MstrUnits { get; set; }
        public virtual MstrColorCard MstrColorCard { get; set; }
        public virtual MstrSizeCard MstrSizeCard { get; set; }
    }
}