using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{  
    [Table("Master.Season")]
    public class MstrSeason
    {
        [Key]
        public int AutoIdx { get; set; }
        
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Season { get; set; }
    }
}