using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.CustomerDetails")]
    public class MstrCustomerDetails
    {
        [Key]
        public int AutoId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Tel { get; set; }
        public bool bActive { get; set; }
        public int CustomerId { get; set; }
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; }
        public MstrCustomerHeader MstrCustomerHeader { get; set; }
    }
}