using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string cAgentName { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string cPassword { get; set; }

        [Required]
        public string Factory { get; set; }
        
        public string cDescription { get; set; }
        
        public string cEmail { get; set; }

        [Required]
        public int iCategoryLevel { get; set; }

        [Required]
        public int bActive { get; set; }
    }
}