using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.MenuUser")]
    public class MstrMenuUser
    {
        [Key]
        public int AutoId { get; set; }

        [ForeignKey("User")] 
        public int UserId { get; set; }

        [ForeignKey("Menu")] 
        public int MenuId { get; set; }

        [ForeignKey("UserId")] 
        public MstrAgents User { get; set; }

        [ForeignKey("MenuId")] 
        public MstrMenuList Menu { get; set; }
    }
}