using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.ProductionDefinition")]
    public class MstrProductionDefinition
    {
        [Key]
        public int AutoId { get; set; }

        [Required]
        public string Name { get; set; }
       
        [Required]
        [ForeignKey("Process")] 
        public int ProcessId { get; set; }

        [ForeignKey("ProcessId")] 
        public virtual MstrProcess Process {get; set;}

        [Required]
        [ForeignKey("Receive")] 
        public int ReceiveSiteId { get; set; }

        [ForeignKey("ReceiveSiteId")] 
        public virtual MstrStoreSite Receive {get; set;}

        [Required]
        [ForeignKey("Dispatch")] 
        public int DispatchSiteId { get; set; }

        [ForeignKey("DispatchSiteId")] 
        public virtual MstrStoreSite Dispatch {get; set;}
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; } 
        
  

        
    }

}