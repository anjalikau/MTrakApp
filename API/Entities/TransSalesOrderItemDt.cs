using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.SalesOrderItemDt")]
    public class TransSalesOrderItemDt
    {
        [Key]
        public int AutoId { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public int SaleOrderId { get; set; }
        public int ArticleId { get; set; }
        public int CostingId { get; set; }
        public int Qty { get; set; }
        public bool IsIntendCreated { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
    }
}