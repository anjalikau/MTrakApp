using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Entities.Admin;

namespace API.Entities
{
    [Table("Master.Location")]
    public class MstrLocation
    {
        [Key]
        public int AutoId { get; set; }

        [Required]
        public int SysModuleId { get; set; }

        [Required]
        [Column(TypeName = "varchar(5)")]
        public string Location { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Description { get; set; }

        [DefaultValue(1)]
        public int TimeZone { get; set; }

        public SystemModule SysModule { get; set; }
    }
}