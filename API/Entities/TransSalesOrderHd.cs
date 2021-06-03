using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.SalesOrderHd")]
    public class TransSalesOrderHd
    {
        [Key]
        public int AutoId { get; set; }
        public string OrderRef { get; set; }
        public string CustomerRef { get; set; }
        public int CustomerId { get; set; }
        public int CustomerDtId { get; set; }
        public DateTime TrnsDate { get; set; }
        public DateTime DelDate { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
    }
}