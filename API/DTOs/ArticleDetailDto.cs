using System;

namespace API.DTOs
{
    public class ArticleDetailDto
    {
        public long AutoId {get;set;}
        public string StockCode {get;set;}
        public string ArticleName {get;set;}
        public string Description1 {get;set;}
        public string Description2 {get;set;}
        public string SizeCardName {get;set;}
        public string ColorCardName {get;set;}
        public string UnitCode {get;set;}
        public string MeasurementCode {get;set;}
        public int ItemTypeId {get;set;}
        public int UnitId {get;set;}
        public int MeasurementId {get;set;}
        public double BoardLength {get;set;}
        public double BoardWidth {get;set;}
        public double RollWidth {get;set;}
        public int ColorCardId {get;set;}
        public int SizeCardId {get;set;}
        public decimal SalesPrice {get;set;}
	    public int QtyInStock {get;set;}
	    public decimal AvgCostPrice {get;set;}
	    public decimal LastCostPrice {get;set;}
	    public decimal MaxCostPrice {get;set;}
        public float Length {get;set;}
	    public float Width {get;set;}
	    public float Height {get;set;}
        public DateTime PODate {get;set;}
    }
}