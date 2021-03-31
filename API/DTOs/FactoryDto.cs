using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class FactoryDto
    {
        public int AutoId { get; set; }

        [Required]
        public string Factory { get; set; }
    }
}