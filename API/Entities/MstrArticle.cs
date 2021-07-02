using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Article")]
    public class MstrArticle
    {
        [Key]
        public long AutoId { get; set; }
        public string ArticleName { get; set; }
        public string StockCode { get; set; }
        public string Description1 { get; set; }
        public string Description2 { get; set; }
        public int ProTypeId {get;set;}
        public int SubCatId {get;set;}
        public int ItemType {get;set;}
        public double BoardLength {get;set;}
        public double BoardWidth {get;set;}
        public int QtyInStock {get;set;}
        public DateTime PODate {get;set;}  
        public int MaterialId { get; set; }
        public int CategoryId { get; set; }
        public int UnitId { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; }
    }
}