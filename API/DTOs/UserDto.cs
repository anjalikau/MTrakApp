namespace API.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }        
        public int ModuleId { get; set; }
        public string UserName { get; set; }
        public string Token { get; set; }
    }
}