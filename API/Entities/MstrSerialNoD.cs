using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.SerialNoDetails")]
    public class MstrSerialNoD
    {
        [Key]
        public int AutoId { get; set; }
        
        public int ModuleId { get; set; }

        public string Name { get; set; }

        public string Prefix { get; set; }

        public int NoOfDigits { get; set; }

        public int Counter { get; set; }
        
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