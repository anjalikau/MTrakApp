using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Color")]
    public class MstrColor
    {
        [Key]
        public int AutoId { get; set; }
        
        [Required]
        public string Code { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [ForeignKey("ColorCard")] 
        public int LinkColorCard { get; set; }

        [ForeignKey("LinkColorCard")] 
        public MstrColorCard ColorCard {get; set;}

        public int ? CreateUserId { get; set; }

        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;

        public int ? UpdateUserId { get; set; }

        public DateTime ? UpdateDateTime { get; set; } 

        
    }
}