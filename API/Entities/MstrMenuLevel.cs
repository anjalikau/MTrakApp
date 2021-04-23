using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.MenuLevel")]
    public class MstrMenuLevel
    {
        [Key]
        public int AutoIdx { get; set; }

        [Required]
        [Column(TypeName = "tinyint")]
        [ForeignKey("Level")]
        public int iCategoryLevel { get; set; }

        [ForeignKey("iCategoryLevel")]
        public MstrAgentLevel Level { get; set; }

        [ForeignKey("MenuList")]
        public int MenuID { get; set; }

        [ForeignKey("MenuID")]
        public MstrMenuList MenuList { get; set; }
    }
}