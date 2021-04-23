using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Factory")]
    public class MstrFactory
    {
        [Key]
        public int AutoId { get; set; }

        [Required]
        [Column(TypeName = "varchar(5)")]
        public string Factory { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Description { get; set; }

        [DefaultValue(1)]
        public int TimeZone { get; set; }
    }
}