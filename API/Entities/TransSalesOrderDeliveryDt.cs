using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.SalesOrderDeliveryDt")]
    public class TransSalesOrderDeliveryDt
    {
        [Key]
        public int AutoId { get; set; }
        public int SOItemDtId { get; set; }
        public string DeliveryRef { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int Qty { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
    }
}