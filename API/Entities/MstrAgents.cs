using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Agents")]
    public class MstrAgents
    {
        [Key]
        public int idAgents { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string cAgentName { get; set; }

        [Required]
        [Column(TypeName = "varchar(24)")]
        public string cPassword { get; set; }

        [Required]
        [Column(TypeName = "varchar(5)")]
        public string Factory { get; set; }
        
        
        [Column(TypeName = "varchar(50)")]
        public string cDescription { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string cEmail { get; set; }

        [Required]
        [Column(TypeName = "tinyint")]
        public int iCategoryLevel { get; set; }  

        [Required]      
        public int bActive { get; set; }

    }
}