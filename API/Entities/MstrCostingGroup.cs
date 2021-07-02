using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.CostingGroup")]
    public class MstrCostingGroup
    {
        [Key]
        public int AutoId { get; set; }

        [Required]
        public string Name { get; set; }

        public bool ? IsMaterialAllocated { get; set; }
        
        public int ? CreateUserId { get; set; }

        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;

        public int ? UpdateUserId { get; set; }

        public DateTime ? UpdateDateTime { get; set; } 
        
        [Required]
        [ForeignKey("UserLocation")] 
        public int LocationId { get; set; }

        [ForeignKey("LocationId")] 
        public virtual MstrUserLocation UserLocation {get; set;}
    }

}