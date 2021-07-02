namespace API.DTOs
{
    public class PendingOrderItemsDto
    {
        public int CustomerId { get; set; }
        public int CombinId { get; set; }
        public int ArticleId { get; set; }
        public string ArticleName { get; set; }
        public string Description1 { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }

    }
}