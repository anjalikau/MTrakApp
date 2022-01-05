using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.CostingHeader")]
    public class TransCostingHeader
    {
        [Key]
        public long AutoId { get; set; }
        public string RefNo { get; set; }
        public int CustomerId { get; set; }
        public long ArticleId { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public int CombinId { get; set; }
        public string Combination { get; set; }
	    public int VersionControl {get;set;}	
        // public int RealSize {get;set;}
        public int NoOfUps {get;set;}
        public int BrandCodeId {get;set;}
        public byte PDHeaderId {get;set;}
        public int Tollerence  { get; set; }
        public decimal BoardLength {get;set;}
        public decimal BoardWidth {get;set;}
        public decimal SQM {get;set;}
        public int ReelSize {get;set;}	
        public decimal ActualReal {get;set;}
        public decimal TrimWaste {get;set;}
        public decimal TotNetWeight {get;set;}
        public decimal TotGrossWeight {get;set;}
        public decimal TotalBoxCost {get;set;}
        public decimal MOQCost {get;set;}
        public decimal Markup {get;set;}        
        public decimal SellingPrice {get;set;}
        public decimal Commission {get;set;}
        public decimal TotMOQCost {get;set;}
        public decimal ProfitMarkup {get;set;}        
        public decimal CommSelPrice {get;set;}
        public DateTime TransDate {get;set;}
        public bool IsActive {get;set;}
        public string Status {get;set;}
        public int ? CreateUserId {get;set;}
        public DateTime ? CreateDateTime {get;set;}
        public int ? UpdateUserId {get;set;}
        public DateTime ? UpdateDateTime {get;set;}
        public virtual MstrCustomerHeader LinkCustomerHeader {get; set;}
        public virtual MstrArticle LinkArticle {get; set;}
        public virtual MstrColor LinkColor {get; set;}
        public virtual MstrSize LinkSize {get; set;}
        public virtual MstrCombination LinkCombination {get; set;}

    }
}