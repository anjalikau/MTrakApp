namespace API.DTOs
{
    public class UserUpdateDto
    {             
        public string cAgentName { get; set; }
        public string cPassword { get; set; }
        public byte[] passwordHash { get; set; }
        public byte[] passwordSalt { get; set; }
    }
}