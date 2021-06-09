using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.JobHeader")]
    public class TransJobHeader
    {
        [Key]
        public int AutoId { get; set; }
        public int CustomerId { get; set; }
        public int ArticleId { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public int Qty { get; set; }
        public int LocationId { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
        public virtual MstrCustomerHeader CustomerHeader {get; set;}
        public virtual MstrArticle Article {get; set;}
        public virtual MstrColor Color {get; set;}
        public virtual MstrSize Size {get; set;}
        public virtual MstrLocation Location {get; set;}

    }
}