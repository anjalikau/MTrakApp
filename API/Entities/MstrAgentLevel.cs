using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
     [Table("Master.AgentLevel")]
    public class MstrAgentLevel
    {
        [Key]
        [Column(TypeName = "tinyint")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoId { get; set; }

        [Required]
        [Column(TypeName = "tinyint")]
        public int AgentLevel { get; set; }

        [Required]
        [Column(TypeName = "tinyint")]
        public int LevelPrority { get; set; }

        [Required]
        [Column(TypeName = "varchar(30)")]
        public string LevelDescription { get; set; }

        public virtual ICollection<MstrAgents> Users {get; set;}
    }
}