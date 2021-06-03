using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Article")]
    public class MstrArticle
    {
        [Key]
        public int AutoId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
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