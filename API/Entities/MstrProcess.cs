using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Process")]
    public class MstrProcess
    {
        [Key]
        public int AutoId { get; set; }

        [Required]
        public string Process { get; set; }
        
        public int ? CreateUserId { get; set; }

        public DateTime ? CreateDateTime { get; set; } = DateTime.Now;

        public int ? UpdateUserId { get; set; }

        public DateTime ? UpdateDateTime { get; set; } 
        
        [Required]
        [ForeignKey("UserLocation")] 
        public int LocationId { get; set; }

        [ForeignKey("LocationId")] 
        public MstrUserLocation UserLocation {get; set;}
    }

}