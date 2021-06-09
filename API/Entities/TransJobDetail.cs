using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.JobDetail")]
    public class TransJobDetail
    {
        [Key]
        public int AutoId { get; set; }
        public int JobHeaderId { get; set; }
        public int SOItemDtId { get; set; }
        public int SODelivDtId { get; set; }
        public int OrderQty { get; set; }
        public int JobQty { get; set; }
        public int Qty { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
        public virtual TransJobHeader JobHeader {get; set;}
        public virtual TransSalesOrderItemDt SOItemDetail {get; set;}
        public virtual TransSalesOrderDeliveryDt SODelivDetail {get; set;}
        
    }
}