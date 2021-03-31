using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class LoginDto
    {
        [Required]        
        public string cAgentName { get; set; }

        [Required]
        public string cPassword { get; set; }
    }
}