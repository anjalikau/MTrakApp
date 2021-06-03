using System;

namespace API.DTOs
{
    public class SalesOrderRetDto
    {
        public int SOHeaderId { get; set; }
        public string OrderRef { get; set; }
        public string CustomerRef { get; set; }
        public int CustomerId { get; set; }
        public int CustomerDtId { get; set; }
        public DateTime TrnsDate { get; set; }
        public DateTime DelDate { get; set; }
        public int SOItemId { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public int SaleOrderId { get; set; }
        public int ArticleId { get; set; }
        public string Article { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public int CostingId { get; set; }
        public int ItemQty { get; set; }
        public bool IsIntendCreated { get; set; }
        public int SODelId { get; set; }
        public string DeliveryRef { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int DelQty { get; set; }
 
    }
}