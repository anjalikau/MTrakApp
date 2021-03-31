using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Agents")]
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
        public int bActive { get; set; }

        [Required] 
        public byte[] passwordHash { get; set; }

        [Required] 
        public byte[] passwordSalt { get; set; }

        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        
        [ForeignKey("Factory_Link")] 
        public int FactoryId { get; set; }

        [ForeignKey("FactoryId")] 
        public MstrFactory Factory_Link { get; set; }

        [ForeignKey("Category_Link")] 
        public int iCategoryLevel { get; set; }  

        [ForeignKey("iCategoryLevel")] 
        public MstrAgentLevel Category_Link { get; set; }

    }
}