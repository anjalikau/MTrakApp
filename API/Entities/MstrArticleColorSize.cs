using System;

namespace API.Entities
{
    public class MstrArticleColorSize
    {
        public long AutoId {get;set;}
        public long ArticleId {get;set;}
        public int ColorId {get;set;}
        public int SizeId {get;set;}
        public int CostingId {get;set;}
        public int ShortOrder {get;set;}
        public int QtyInStock {get;set;}
        public decimal AvgCostPrice {get;set;}
        public decimal LastCostPrice {get;set;}
        public decimal MaxCostPrice {get;set;}
        public DateTime PODate {get;set;}
        public decimal QtyOnOrder {get;set;}
        public decimal QtyAllocated {get;set;}
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; }
        public virtual MstrArticle MstrArticle { get; set; }
        public virtual MstrColor MstrColor { get; set; }
        public virtual MstrSize MstrSize { get; set; }

    }
}