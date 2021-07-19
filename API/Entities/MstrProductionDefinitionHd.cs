using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.ProductionDefinitionHd")]
    public class MstrProductionDefinitionHd
    {
        [Key]
        public int AutoId { get; set; }        
        public string PDName { get; set; }  
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
               
    }

}