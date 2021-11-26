using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Company")]
    public class MstrCompany
    {
        [Key]
        public int AutoId { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public int DefCurrencyId { get; set; }
        
    }
}