using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.Combination")]
    public class MstrCombination
    {
        [Key]
        public int AutoId { get; set; }
        public string Combination { get; set; }
    }
}