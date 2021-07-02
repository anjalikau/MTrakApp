using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.CostHeader")]
    public class TransCostHeader
    {
        [Key]
        public int AutoId { get; set; }
        public int CustomerId { get; set; }
        public int ArticleId { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public int CombinId { get; set; }
        public virtual MstrCustomerHeader CustomerHeader {get; set;}
        public virtual MstrArticle Article {get; set;}
        public virtual MstrColor Color {get; set;}
        public virtual MstrSize Size {get; set;}
        public virtual MstrCombination Combination {get; set;}

    }
}